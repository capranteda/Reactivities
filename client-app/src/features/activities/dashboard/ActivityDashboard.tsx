import { observer } from 'mobx-react-lite';
import React, { useEffect, useState, Fragment } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Button, Grid, Loader } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';
import ActivityListItemPlaceholder from './ActivityListItemPlaceHolder';

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadActivities, activityRegistry, setPagingParams, pagination } = activityStore;
    //Creamos un useState loadingNext y letLoadingNext para ir mostrando las paginas
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        //cargamos los nuevos params en el activityStore
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        //cargamos los nuevos activities con los params ya actualizados
        loadActivities().then(() => setLoadingNext(false));


    }


    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities();
    }, [activityRegistry.size, loadActivities])



    return (
        <Grid>
            <Grid.Column width='10'>
                {activityStore.loadingInitial && !loadingNext ? (

                    <Fragment>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </Fragment>
                ) : (
                    /* Envolvemos el activityList en el infiniteScroll */
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                {/* Metemos un loader para que muestre abajo mientras carga mas actividades */}
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
})