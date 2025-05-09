import { Property, User } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Banesë luksoze në qendër të Prishtinës',
    description: 'Banesë e re me tri dhoma gjumi në qendër të Prishtinës, afër sheshit Skënderbeu',
    price: 750,
    location: 'Prishtinë',
    type: 'apartment',
    listingType: 'rent',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1560&q=80'
    ],
    features: ['Parking', 'Ballkon', 'Ngrohje qendrore', 'Ashensor'],
    rooms: 3,
    bathrooms: 2,
    area: 85,
    userId: '1',
    featured: true,
    createdAt: new Date('2023-08-15')
  },
  {
    id: '2',
    title: 'Shtëpi e bukur në Prizren',
    description: 'Shtëpi familjare me kopësht të madh në një lagje të qetë në Prizren',
    price: 120000,
    location: 'Prizren',
    type: 'house',
    listingType: 'sale',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    ],
    features: ['Garazha', 'Kopësht', 'Sistem alarmi', 'Pishina'],
    rooms: 5,
    bathrooms: 3,
    area: 180,
    userId: '2',
    featured: false,
    createdAt: new Date('2023-09-05')
  },
  {
    id: '3',
    title: 'Lokal në qendër të Pejës',
    description: 'Lokal afarist i përshtatshëm për restorant ose dyqan në rrugën kryesore në Pejë',
    price: 800,
    location: 'Pejë',
    type: 'commercial',
    listingType: 'rent',
    images: [
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    ],
    features: ['Qasje nga rruga kryesore', 'Vitrina', 'Sistem i sigurisë', 'Depo'],
    area: 120,
    userId: '3',
    featured: true,
    createdAt: new Date('2023-10-10')
  },
  {
    id: '4',
    title: 'Tokë bujqësore në Ferizaj',
    description: 'Tokë bujqësore pjellore afër autostradës, e përshtatshme për kultivimin e perimeve',
    price: 50000,
    location: 'Ferizaj',
    type: 'land',
    listingType: 'sale',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
    ],
    features: ['Ujë për ujitje', 'Qasje nga rruga', 'Plan urbanistik'],
    area: 5000,
    userId: '2',
    featured: false,
    createdAt: new Date('2023-11-20')
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Arlind Morina',
    email: 'arlind@example.com',
    password: 'password123',
    userType: 'landlord',
    isPremium: true,
    premiumUntil: new Date('2024-12-31'),
    properties: ['1']
  },
  {
    id: '2',
    name: 'Liridona Krasniqi',
    email: 'liridona@example.com',
    password: 'password123',
    userType: 'seller',
    isPremium: false,
    properties: ['2', '4']
  },
  {
    id: '3',
    name: 'Burim Gashi',
    email: 'burim@example.com',
    password: 'password123',
    userType: 'landlord',
    isPremium: true,
    premiumUntil: new Date('2024-10-15'),
    properties: ['3']
  }
];