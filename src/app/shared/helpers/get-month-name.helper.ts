const monthNames: string[] = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

export function getMonthName(month: number): string {
    return monthNames[month - 1];
}

export function getMonthNameFromDate(date: Date): string {
    return monthNames[date.getMonth() + 1]
}



