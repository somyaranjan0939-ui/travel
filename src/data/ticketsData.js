export const TICKETS_DATA = [
  {
    id: 't1',
    mode: 'flight',
    modeName: 'Flight',
    carrier: 'SkyLuxe Airways',
    flightNo: 'SL-402',
    origin: 'New York (JFK)',
    destination: 'London (LHR)',
    departureTime: '08:30 AM',
    arrivalTime: '08:45 PM',
    duration: '7h 15m',
    type: 'Non-stop',
    price: 480,
    seatsAvailable: 14,
    baggage: '1 Carry-on (10kg) + 2 Checked Bags (23kg each)',
    features: ['In-flight Wi-Fi', 'Complimentary Gourmet Meal', 'USB Power Outlet', 'On-demand Entertainment'],
    classes: [
      { name: 'Economy Classic', multiplier: 1.0, seatType: 'Standard Recline' },
      { name: 'Premium Economy', multiplier: 1.45, seatType: 'Extra Legroom + Priority Boarding' },
      { name: 'Business Class Lie-Flat', multiplier: 2.8, seatType: 'Private Suite + Lounge Access' }
    ]
  },
  {
    id: 't2',
    mode: 'flight',
    modeName: 'Flight',
    carrier: 'Air France',
    flightNo: 'AF-1184',
    origin: 'London (LHR)',
    destination: 'Paris (CDG)',
    departureTime: '11:15 AM',
    arrivalTime: '01:35 PM',
    duration: '1h 20m',
    type: 'Non-stop',
    price: 95,
    seatsAvailable: 28,
    baggage: '1 Carry-on (12kg)',
    features: ['Complimentary Snacks & French Wine', 'Fast Check-in', 'Mobile Boarding Pass'],
    classes: [
      { name: 'Standard Economy', multiplier: 1.0, seatType: 'Standard Window/Aisle' },
      { name: 'Flexi Economy', multiplier: 1.3, seatType: 'Front of Cabin + Free Changes' }
    ]
  },
  {
    id: 't3',
    mode: 'train',
    modeName: 'High-Speed Rail',
    carrier: 'Shinkansen Nozomi',
    flightNo: 'SH-88',
    origin: 'Tokyo (Tokyo Station)',
    destination: 'Kyoto (Kyoto Station)',
    departureTime: '09:00 AM',
    arrivalTime: '11:15 AM',
    duration: '2h 15m',
    type: 'Bullet Train Express',
    price: 110,
    seatsAvailable: 42,
    baggage: '2 pieces standard luggage allowed',
    features: ['High-Speed 320 km/h', 'Quiet Cabin', 'Fuji Mountain View Side', 'Power Socket every seat'],
    classes: [
      { name: 'Standard Reserved', multiplier: 1.0, seatType: 'Reserved Row Seat' },
      { name: 'Green Car (First Class)', multiplier: 1.6, seatType: 'Plush Wide Recliner + Attendant' }
    ]
  },
  {
    id: 't4',
    mode: 'train',
    modeName: 'High-Speed Rail',
    carrier: 'Eurostar Express',
    flightNo: 'ES-9014',
    origin: 'Paris (Gare du Nord)',
    destination: 'London (St Pancras)',
    departureTime: '02:20 PM',
    arrivalTime: '03:40 PM',
    duration: '2h 20m',
    type: 'Direct Tunnel Rail',
    price: 125,
    seatsAvailable: 19,
    baggage: '2 large bags + 1 hand luggage',
    features: ['Cross-Channel Tunnel', 'Café Bar Car', 'Free Wi-Fi', 'City-Center to City-Center'],
    classes: [
      { name: 'Standard Class', multiplier: 1.0, seatType: 'Comfy fabric seat' },
      { name: 'Standard Premier', multiplier: 1.55, seatType: 'Light meal served at seat + spacious desk' }
    ]
  },
  {
    id: 't5',
    mode: 'bus',
    modeName: 'Luxury Sleeper Bus',
    carrier: 'Coastal Cruiser Luxury Line',
    flightNo: 'CC-302',
    origin: 'Mumbai (Borivali)',
    destination: 'Goa (Panaji)',
    departureTime: '07:30 PM',
    arrivalTime: '08:00 AM',
    duration: '12h 30m',
    type: 'Overnight Sleeper',
    price: 42,
    seatsAvailable: 8,
    baggage: '2 Luggage bags up to 30kg',
    features: ['Individual AC Berth', 'Personal TV Screen', 'Reading Lamp', 'Water Bottle & Blanket Provided'],
    classes: [
      { name: 'Single Lower Berth', multiplier: 1.0, seatType: 'Private Single Bed' },
      { name: 'Double Suite Berth', multiplier: 1.75, seatType: 'Couples Spacious Bed' }
    ]
  },
  {
    id: 't6',
    mode: 'flight',
    modeName: 'Flight',
    carrier: 'Garuda Indonesia',
    flightNo: 'GA-408',
    origin: 'Singapore (SIN)',
    destination: 'Bali (DPS)',
    departureTime: '01:45 PM',
    arrivalTime: '04:35 PM',
    duration: '2h 50m',
    type: 'Non-stop',
    price: 140,
    seatsAvailable: 12,
    baggage: '1 Carry-on + 1 Checked bag (20kg)',
    features: ['Tropical Refreshments', 'Extra Legroom', 'Priority Baggage'],
    classes: [
      { name: 'Economy Special', multiplier: 1.0, seatType: 'Standard' },
      { name: 'Business Comfort', multiplier: 2.1, seatType: 'Wide Recliner' }
    ]
  }
];
