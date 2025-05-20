'use client';

import Image from "next/image";
import { useState } from "react";

interface IActivities {
  
}

interface Activity {
  title: string;
  description: string;
  date: string;
}

const aggregateByMonth = (activities: Activity[]) => {
  const groupedActivities: { [key: string]: Activity[] } = {};

  activities.forEach(activity => {
    const month = new Date(activity.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!groupedActivities[month]) {
      groupedActivities[month] = [];
    }
    groupedActivities[month].push(activity);
  });

  return groupedActivities;
};

export const MiddleActivities: React.FC<IActivities> = ({
}) => {
  const [activities, setActivities] = useState([
    {
      title: 'Service Booking',
      description: 'Lorem ipsum dolor sit amet kin tube ioso ilensga riosnfoma rlodms cicira',
      date: '2024-08-31T00:00:00',
    },
    {
      title: 'Attended an event',
      description: 'Lorem ipsum dolor sit amet kin tube ioso ilensga riosnfoma rlodms cicira',
      date: '2024-08-28T00:00:00',
    },
    {
      title: 'Attended an event',
      description: 'Lorem ipsum dolor sit amet kin tube ioso ilensga riosnfoma rlodms cicira',
      date: '2024-08-07T00:00:00',
    },
    {
      title: 'Vehicle Purchase',
      description: 'Lorem ipsum dolor sit amet kin tube ioso ilensga riosnfoma rlodms cicira',
      date: '2024-07-10T00:00:00',
    },
    {
      title: 'Visited the showroom',
      description: 'Lorem ipsum dolor sit amet kin tube ioso ilensga riosnfoma rlodms cicira',
      date: '2024-07-09T00:00:00',
    }
  ]);

  return (
    <div>
      {Object.entries(aggregateByMonth(activities)).map((val, idx) => (
        <div key={idx} className="flex flex-col gap-y-2 p-3">
          <span className="text-neutrals-high body_small_semibold">{val[0]}</span>
          <div className="flex flex-col gap-y-2">
            {val[1].map((activity, index) => (
              <div key={index} className="flex items-start bg-neutrals-background-default border-[1px] border-neutrals-low shadow-subtle-shadow2 p-2">
                <div className="flex items-center gap-x-2 w-full h-full">
                  
                  <div className="p-1">
                    <div className="shadow-subtle-shadow2 bg-gradient-5 relative">
                      <Image src="/images/rect-secondary.svg" width={12} height={12} alt="rect-secondary" className="absolute top-0 left-0" />
                      <div className="flex flex-col items-center px-3 py-1">
                        {/* Month (Aug) */}
                        <span className="caption_xs_regular text-neutrals-background-shading">{new Date(activity.date).toLocaleString('default', { month: 'short' }).toLocaleUpperCase()}</span>
                        {/* Day (31) */}
                        <span className="sub_heading_3_semibold text-neutrals-background-default">{new Date(activity.date).getDate()}</span>
                        {/* Year (2024) */}
                        <span className="caption_xs_regular text-neutrals-background-shading">{new Date(activity.date).getFullYear()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-2 justify-between h-full">
                    <div className="body_small_semibold">{activity.title}</div>
                    <div className="caption_regular text-neutrals-medium">{activity.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
};