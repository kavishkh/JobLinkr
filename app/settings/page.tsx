'use client'

import React, { useState } from 'react'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { currentUser } from '@/lib/mockData'
import { toast } from 'sonner'
import { Settings as SettingsIcon, Bell, Lock, User, Palette } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'

export default function SettingsPage() {
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState('profile')
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: session?.user?.name || currentUser.name,
        email: session?.user?.email || 'alex.johnson@example.com',
        headline: currentUser.headline,
        location: currentUser.location || '',
        about: currentUser.about || ''
    })

    // Mock toggle states
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: false
    })

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Save instantly
        setIsLoading(false)
        toast.success('Profile updated successfully')
    }

    const handleSavePreferences = () => {
        toast.success('Preferences saved successfully')
    }

    return (
        <main className="min-h-screen bg-background w-full">
            <Navbar />

            <div className="flex gap-8">
                <Sidebar />
                <div className="flex-1 w-full px-6 py-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <SettingsIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Settings</h1>
                            <p className="text-muted-foreground">Manage your account preferences and settings</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto w-full">
                        {/* Needs fixing: Add right margin to the sidebar itself in its component or here */}
                        {/* Settings Sidebar */}
                        <div className="w-full md:w-64 space-y-2 shrink-0">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                                    }`}
                            >
                                <User className="w-4 h-4" />
                                Profile Information
                            </button>
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'account' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                                    }`}
                            >
                                <Lock className="w-4 h-4" />
                                Account & Security
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                                    }`}
                            >
                                <Bell className="w-4 h-4" />
                                Notifications
                            </button>
                        </div>

                        {/* Settings Content */}
                        <div className="flex-1 w-full max-w-3xl">
                            {activeTab === 'profile' && (
                                <Card className="w-full">
                                    <CardHeader>
                                        <CardTitle>Profile Information</CardTitle>
                                        <CardDescription>
                                            Update your profile details and public-facing information.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSaveProfile} className="space-y-6">
                                            <div className="flex items-center gap-6">
                                                <Avatar className="w-20 h-20">
                                                    <AvatarImage src={session?.user?.image ?? ''} />
                                                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                                        {(session?.user?.name || formData.name).charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <Button variant="outline" size="sm" type="button">Change Avatar</Button>
                                                    <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 800K</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email address</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="headline">Headline</Label>
                                                <Input
                                                    id="headline"
                                                    value={formData.headline}
                                                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Input
                                                    id="location"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="about">About</Label>
                                                <textarea
                                                    id="about"
                                                    rows={4}
                                                    className="w-full min-h-[100px] flex rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={formData.about}
                                                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                                />
                                            </div>

                                            <Button type="submit" disabled={isLoading}>
                                                {isLoading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'account' && (
                                <Card className="w-full">
                                    <CardHeader>
                                        <CardTitle>Account & Security</CardTitle>
                                        <CardDescription>
                                            Manage your password and security settings.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium text-foreground">Change Password</h4>
                                            <div className="space-y-2">
                                                <Label htmlFor="current-pw">Current Password</Label>
                                                <Input id="current-pw" type="password" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-pw">New Password</Label>
                                                <Input id="new-pw" type="password" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-pw">Confirm New Password</Label>
                                                <Input id="confirm-pw" type="password" />
                                            </div>
                                            <Button onClick={() => toast.success('Password updated')}>Update Password</Button>
                                        </div>

                                        <div className="pt-6 border-t border-border">
                                            <h4 className="text-sm font-medium text-destructive mb-2">Danger Zone</h4>
                                            <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                            <Button variant="destructive" onClick={() => toast.error('Account deletion requested')}>Delete Account</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'notifications' && (
                                <Card className="w-full">
                                    <CardHeader>
                                        <CardTitle>Notifications</CardTitle>
                                        <CardDescription>
                                            Choose what updates you want to receive.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">

                                            {/* Simple toggle switches since we might not have the shadcn Switch component imported */}
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Email Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">Receive daily digests and important updates.</p>
                                                </div>
                                                <button
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${notifications.email ? 'bg-primary' : 'bg-input'}`}
                                                    onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                                                >
                                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Push Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">Get notified immediately about messages and interview requests.</p>
                                                </div>
                                                <button
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${notifications.push ? 'bg-primary' : 'bg-input'}`}
                                                    onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                                                >
                                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${notifications.push ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Marketing Emails</Label>
                                                    <p className="text-sm text-muted-foreground">Receive promotional offers and newsletters.</p>
                                                </div>
                                                <button
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${notifications.marketing ? 'bg-primary' : 'bg-input'}`}
                                                    onClick={() => setNotifications({ ...notifications, marketing: !notifications.marketing })}
                                                >
                                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${notifications.marketing ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>

                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={handleSavePreferences}>Save Preferences</Button>
                                    </CardFooter>
                                </Card>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
