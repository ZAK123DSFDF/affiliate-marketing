// app/create-company/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { CreateOrganization } from "@/actions/auth/CreateOrganization";

// Updated schema with domainName
const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers and hyphens allowed",
    ),
  domainName: z
    .string()
    .min(2, "Domain must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+(\.[a-z]{2,})+$/i,
      "Please enter a valid domain (e.g., yourcompany.com)",
    ),
});

const CreateCompany = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      slug: "",
      domainName: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateOrganization,
    onSuccess: (data: any) => {
      toast({
        title: "Company created successfully!",
        description: "Your organization is ready to use.",
      });
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error creating company",
        description: error.message || "Please try again later",
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof companySchema>) => {
    try {
      setPending(true);
      mutate(data);
    } catch (error) {
      console.error("Create company failed", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Create Your Company
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="domainName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Domain</FormLabel>
                      <FormControl>
                        <Input placeholder="yourcompany.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company URL</FormLabel>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">
                          affiliatex.com/
                        </span>
                        <FormControl>
                          <Input placeholder="acme-inc" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Company"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCompany;
