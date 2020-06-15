

let tileSet = [
    {
        name: 'blank',
        baseColor: 'white',
        borderColor: 'grey',
        opacity: .75,
    },
    {
        name: '5',
        displayName: '5',
        baseColor: 'yellow',
        borderColor: 'black',
        values: [20],
        track: [{ name: 'HalfStraight', props: { rotation: 4 } },
        { name: 'HalfStraight', props: { rotation: 5 } }],
        revenue: [{ name: 'SingleCity', value: 20 },
        { name: 'RevenueMarker', props: { rotation: 0, value: 20 } },
        { name: 'Token', props: { color: 'blue', center: [0,0], text: 'hey', fontColor: 'white' } }],
    },
    {
        name: '6',
        displayName: '6',
        baseColor: 'yellow',
        borderColor: 'black',
        values: [20],
        track: [{ name: 'HalfStraight', props: { rotation: 3 } },
        { name: 'HalfStraight', props: { rotation: 5 } }],
        revenue: [{ name: 'SingleCity', value: 20 },
        { name: 'RevenueMarker', props: { rotation: 0, value: 20 } }],
    },
    {
        name: '57',
        displayName: '57',
        baseColor: 'yellow',
        borderColor: 'black',
        values: [20],
        track: [{ name: 'Straight', props: { rotation: 0 } }],
        revenue: [{ name: 'SingleCity', value: 20 },
        { name: 'RevenueMarker', props: { rotation: 0, value: 20 } }],
    },
];

export default tileSet;