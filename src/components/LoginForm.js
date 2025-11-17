"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Header from "@/components/Header";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { Mail, Lock, CheckCircle } from "lucide-react";

export default function LoginForm({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            const { data, error: supaError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (supaError) {
                setError(supaError.message);
                return;
            }

            onLoginSuccess(data.user);

        } catch (err) {
            console.error(err);
            setError("Something went wrong during login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <Header />

            {/* Centered Login Container */}
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Login</h1>
                    <p className="text-gray-600">Sign in to access your doctor dashboard</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>
                            Enter your email and password to access your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Email Input */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        placeholder="doctor@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Bottom Link */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

