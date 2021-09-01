using System;
using Application.core;

namespace Application.Activities
{
    //La hacemos heredar de PagingParams
    public class ActivityParams : PagingParams
    {
        public bool IsGoing { get; set; }
        public bool IsHost { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }
}