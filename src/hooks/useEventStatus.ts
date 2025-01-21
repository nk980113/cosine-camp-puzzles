'use client';

import { EventStatusContext, EventStatusDispatchContext } from '@/contexts/EventStatusContext';
import { useContext } from 'react';

export default function useEventStatus() {
    return [useContext(EventStatusContext), useContext(EventStatusDispatchContext)] as const;
}