"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react";


export default function RegisterDoctor() {
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
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");



        try {
            const { data, error } = await supabase
                .from("doctors")
                .insert([
                    {
                        name: formData.name,
                        specialty: formData.specialty,
                        department: formData.department,
                        rating: formData.rating ? parseFloat(formData.rating) : null,
                        image_url: formData.image_url,
                    },
                ])
                .select();

            if (error) {
                console.error("Supabase Error:", error.message || error);
                setMessage("❌ Failed to register doctor.");
            } else {
                console.log("Inserted doctor:", data);
                setMessage("✅ Doctor registered successfully!");
                setFormData({
                    name: "",
                    specialty: "",
                    department: "",
                    rating: "",
                    image_url: "",
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md space-y-4"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Doctor Registration</h1>
                </div>



                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Dr. John Doe"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                        id="specialty"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleChange}
                        placeholder="Cardiology, Pediatrics..."
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Medicine, Surgery..."
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                        id="rating"
                        name="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleChange}
                        placeholder="4.5"
                    />
                </div>

                <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                        id="image_url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="https://example.com/photo.jpg"
                    />
                </div>

                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={loading}>
                    {loading ? "Registering..." : "Register Doctor"}
                </Button>

                {message && <p className="text-center mt-3">{message}</p>}
            </form>

        </div>

    )
}
