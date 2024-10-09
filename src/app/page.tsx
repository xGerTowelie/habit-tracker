/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useCallback } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const localizer = momentLocalizer(moment)

type HabitCompletion = {
    [date: string]: number
}

type HabitStats = {
    id: number
    name: string
    completionRate: number
    longestStreak: number
    currentStreak: number
}

export default function HabitTracker() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [habitCompletion, setHabitCompletion] = useState<HabitCompletion>({
        '2023-05-01': 3, '2023-05-02': 2, '2023-05-03': 1, '2023-05-04': 3, '2023-05-05': 0,
        '2023-05-06': 2, '2023-05-07': 1, '2023-05-08': 3, '2023-05-09': 2, '2023-05-10': 1,
        '2023-05-11': 0, '2023-05-12': 3, '2023-05-13': 2, '2023-05-14': 1, '2023-05-15': 3,
        '2023-05-16': 0, '2023-05-17': 2, '2023-05-18': 1, '2023-05-19': 3, '2023-05-20': 2,
        '2023-05-21': 1, '2023-05-22': 3, '2023-05-23': 0, '2023-05-24': 2, '2023-05-25': 1,
        '2023-05-26': 3, '2023-05-27': 2, '2023-05-28': 1, '2023-05-29': 0, '2023-05-30': 3,
        '2023-05-31': 2
    })
    const [habitStats, setHabitStats] = useState<HabitStats[]>([
        { id: 1, name: 'Morning Meditation', completionRate: 85, longestStreak: 14, currentStreak: 5 },
        { id: 2, name: 'Read 30 minutes', completionRate: 92, longestStreak: 21, currentStreak: 12 },
        { id: 3, name: 'Exercise', completionRate: 70, longestStreak: 10, currentStreak: 3 },
        { id: 4, name: 'Software Project', completionRate: 100, longestStreak: 200, currentStreak: 200 },
    ])

    const getColorForCompletion = (completion: number) => {
        if (completion === 0) return 'bg-gray-100'
        if (completion === 1) return 'bg-blue-100'
        if (completion === 2) return 'bg-blue-200'
        return 'bg-blue-300'
    }

    const customDayPropGetter = useCallback(
        (date: Date) => {
            const dateString = moment(date).format('YYYY-MM-DD')
            const completion = habitCompletion[dateString] || 0
            return {
                className: `${getColorForCompletion(completion)} hover:opacity-75 transition-opacity`,
            }
        },
        [habitCompletion]
    )

    const CustomToolbar = ({ date, onNavigate }: { date: Date; onNavigate: (action: 'PREV' | 'NEXT') => void }) => {
        return (
            <div className="rbc-toolbar flex justify-between items-center mb-4">
                <button
                    type="button"
                    onClick={() => onNavigate('PREV')}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <span className="rbc-toolbar-label text-xl font-semibold text-gray-800">{moment(date).format('MMMM YYYY')}</span>
                <button
                    type="button"
                    onClick={() => onNavigate('NEXT')}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen p-4 bg-white text-gray-800">
            <div className="flex-1">
                <Calendar
                    localizer={localizer}
                    events={[]}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    onNavigate={(newDate) => setCurrentDate(newDate)}
                    date={currentDate}
                    views={['month']}
                    defaultView={Views.MONTH}
                    dayPropGetter={customDayPropGetter}
                    components={{
                        toolbar: CustomToolbar,
                    }}
                />
                <div className="mt-4 flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-100 mr-2 border border-gray-300"></div>
                        <span className="text-sm text-gray-600">No habits</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-100 mr-2 border border-blue-200"></div>
                        <span className="text-sm text-gray-600">1 habit</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-200 mr-2 border border-blue-300"></div>
                        <span className="text-sm text-gray-600">2 habits</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-300 mr-2 border border-blue-400"></div>
                        <span className="text-sm text-gray-600">3+ habits</span>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Habit Statistics</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {habitStats.map(habit => (
                        <div key={habit.id} className="bg-white p-4 rounded shadow-md border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
                            <div className="mt-2 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Completion Rate:</span>
                                    <span className="font-medium text-sm text-gray-800">{habit.completionRate}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded">
                                    <div
                                        className="bg-blue-500 rounded h-2"
                                        style={{ width: `${habit.completionRate}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Longest Streak:</span>
                                    <span className="font-medium text-sm text-gray-800">{habit.longestStreak} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Current Streak:</span>
                                    <span className="font-medium text-sm text-gray-800">{habit.currentStreak} days</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
