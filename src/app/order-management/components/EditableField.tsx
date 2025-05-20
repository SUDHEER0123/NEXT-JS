import { useState, FC } from 'react';
import Image from 'next/image';
import { ActionIcon } from '@mantine/core';
import { formatNumberWithCommas } from '@/utils/common';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface EditableFieldProps {
    label: string;
    value: number | null | undefined;
    onSave: (updatedValue: number) => void;
}

const EditableField: FC<EditableFieldProps> = ({ label, value, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value !== null && value !== undefined ? String(value) : '');

    const handleCancel = () => {
        setIsEditing(false);
        setTempValue(value !== null && value !== undefined ? String(value) : '');
    };

    const handleSave = () => {
        const numericValue = parseFloat(tempValue);
        if (!isNaN(numericValue)) {
            onSave(numericValue);
        }
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (/^\d*\.?\d*$/.test(newValue)) {
            setTempValue(newValue);
        }
    };

    return (
        <div className="flex flex-col">
            <p className="caption_small_regular text-neutrals-low">{label}</p>
            <div className="flex items-center gap-x-1">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            className="border border-neutrals-medium outline-none focus:ring-0 focus:border-none px-2 py-1 w-24 rounded text-sm bg-neutrals-low text-stone-600"
                            value={tempValue}
                            placeholder="Enter Data"
                            onChange={handleChange}
                        />

                        <div className="w-[30px] h-[30px] bg-green-900 flex items-center justify-center rounded-[100%] cursor-pointer" onClick={handleSave}>
                            <FaCheck size={14} className="text-white" />
                        </div>

                        <div className="w-[30px] h-[30px] bg-neutrals-low flex items-center justify-center rounded-[100%] cursor-pointer" onClick={handleCancel}>
                            <FaTimes size={14} className="text-neutrals-medium" />
                        </div>
                    </>
                ) : (
                    <>
                        <p className="caption_regular text-neutrals-background-default">
                            {value !== null && value !== undefined
                                ? formatNumberWithCommas(value)
                                : 'Enter Data'}
                        </p>
                        <ActionIcon onClick={() => setIsEditing(true)} variant="transparent">
                            <Image src="/icons/txt-edit-btn.svg" width={16} height={16} alt="edit" />
                        </ActionIcon>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditableField;
