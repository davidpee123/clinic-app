// components/SearchFilter.js

import { Search, ChevronDown } from 'lucide-react';
import { useEffect } from 'react'; // <--- 1. Crucial: You must import useEffect

export default function SearchFilter({ specialties, selectedSpecialty, setSelectedSpecialty, loading }) {
    
    // Set the default selection ('All Specialties') on initial load if not already set
    useEffect(() => {
        if (!selectedSpecialty && specialties.length > 0) {
            setSelectedSpecialty('All Specialties');
        }
    }, [specialties, selectedSpecialty, setSelectedSpecialty]);

    const handleSelectChange = (event) => {
        setSelectedSpecialty(event.target.value);
    };

    return (
        <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <select
                id="specialty-filter"
                value={selectedSpecialty}
                onChange={handleSelectChange}
                disabled={loading || specialties.length === 0}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 cursor-pointer"
            >
                {loading ? (
                    <option value="">Loading specialties...</option>
                ) : (
                    specialties.map((spec) => (
                        // Added check to ensure 'spec' is a valid string/value for key and option text
                        <option key={spec || 'default'} value={spec}>
                            {spec}
                        </option>
                    ))
                )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
    );
}