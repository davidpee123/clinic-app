"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from "@/components/Header" // Imported Header
import { Heart } from "lucide-react";


export default function RegisterDoctor() {
    // NOTE: Supabase client is assumed to be working in this environment
    const supabase = createClientComponentClient()
    const [formData, setFormData] = useState({
        name: "",
        specialty: "",
        department: "",
        rating: "",
        image_url: "",
        created_at: "", // We'll include this as a hidden or auto field
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // Ensure rating is stored as string/null if empty, but parsed on submit
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            // Note: For a real-world application, ensure these fields are properly validated
            const { error } = await supabase
                .from("doctors")
                .insert([
                    {
                        name: formData.name,
                        specialty: formData.specialty,
                        department: formData.department,
                        // Convert rating to float, or null if empty
                        rating: formData.rating ? parseFloat(formData.rating) : null,
                        image_url: formData.image_url,
                    },
                ])
                .select(); // Added .select() as recommended practice

            if (error) {
                console.error("Supabase Error:", error.message || error);
                setMessage("❌ Failed to register doctor.");
            } else {
                setMessage("✅ Doctor registered successfully!");
                // Clear the form after successful submission
                setFormData({
                    name: "",
                    specialty: "",
                    department: "",
                    rating: "",
                    image_url: "",
                    created_at: "",
                });
            }
        } catch (err) {
            console.error("Unexpected Error:", err);
            setMessage("⚠️ Something went wrong, please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        // Main wrapper now just sets the background and min-height
        <div className="min-h-screen bg-gray-50">
            {/* RENDER THE HEADER COMPONENT */}
            <Header /> 

            {/* Content Container: Centers the form horizontally and vertically (if space allows) */}
            <div className="flex justify-center items-center py-12 px-4">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6 border border-gray-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#193cb8] rounded-full flex items-center justify-center shadow-lg">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-800">Join Our Team</h1>
                    </div>

                    {/* Form Fields */}
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Dr. your Name"
                            required
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="specialty">Specialty</Label>
                        <Input
                            id="specialty"
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            placeholder="General Practitioner"
                            required
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="Telemedicine / Primary Care"
                            required
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="rating">Rating (0.0 to 5.0)</Label>
                        <Input
                            id="rating"
                            name="rating"
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={formData.rating}
                            onChange={handleChange}
                            placeholder="Optional: 4.8"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="image_url">Profile Image URL</Label>
                        <Input
                            id="image_url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="https://example.com/photo.jpg"
                            className="mt-1"
                        />
                    </div>

                    <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 transition-colors py-3" disabled={loading}>
                        {loading ? "Processing..." : "Submit Registration"}
                    </Button>

                    {message && <p className={`text-center mt-4 font-medium ${message.startsWith('❌') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
                </form>
            </div>
        </div>
    )
}
