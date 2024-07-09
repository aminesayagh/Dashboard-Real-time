'use client';
import { Select, SelectItem } from '@nextui-org/react';
import type { TSelect, TSelectItem } from './types';

const SelectUi: TSelect = ({ ...props }) => {
    return <Select { ...props } />;
}

export const SelectItemUi: TSelectItem = ({ ...props }) => {
    return <SelectItem { ...props } />;
}

export default SelectUi;