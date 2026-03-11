import { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, ShoppingBag, Store, User, Mail, Lock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER" as UserRole,
    storeName: "",
  });
  const { register, isLoading } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (formData.role === 'VENDOR' && !formData.storeName) {
      toast({
        title: "Error",
        description: "Please provide a store name",
        variant: "destructive",
      });
      return;
    }

    const success = await register(formData.email, formData.password, formData.name, formData.role, formData.storeName);
    
    if (success) {
      toast({
        title: "Account created!",
        description: `Welcome to VendorHub! You're now registered as a ${formData.role}.`,
      });
    } else {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="gradient-primary rounded-xl p-3 w-16 h-16 mx-auto shadow-glow">
            <div className="w-full h-full rounded-lg bg-white/20"></div>
          </div>
          <h1 className="text-2xl font-bold">Join VendorHub</h1>
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>

        <Card className="shadow-elegant animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Choose your account type and fill in your details
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label>I want to:</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value)}
                  className="grid grid-cols-1 gap-3"
                >
                  <div>
                    <RadioGroupItem
                      value="CUSTOMER"
                      id="customer"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="customer"
                      className="flex items-center space-x-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Buy Products</div>
                        <div className="text-sm text-muted-foreground">Shop from various vendors</div>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="VENDOR"
                      id="vendor"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="vendor"
                      className="flex items-center space-x-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Store className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Sell Products</div>
                        <div className="text-sm text-muted-foreground">List and manage your products</div>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="ADMIN"
                      id="admin"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="admin"
                      className="flex items-center space-x-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Shield className="h-5 w-5" />
                      <div>
                        <div className="font-medium">System Administrator</div>
                        <div className="text-sm text-muted-foreground">Manage users and vendors</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Registration Form */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
              </div>

              {formData.role === 'VENDOR' && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="storeName">Store Name</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="storeName"
                      type="text"
                      placeholder="Enter your store name"
                      className="pl-10"
                      value={formData.storeName}
                      onChange={(e) => handleInputChange('storeName', e.target.value)}
                      required={formData.role === 'VENDOR'}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="space-y-4">
              <Button
                type="submit"
                className="w-full gradient-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;