// app/create-company/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CreateOrganization } from "@/actions/auth/CreateOrganization";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const companySchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/),
  domainName: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+(\.[a-z]{2,})+$/i),

  logoUrl: z.string().url().optional().or(z.literal("")),
  referralParam: z.enum(["ref", "via", "aff"]),
  cookieLifetimeValue: z.number().min(1),
  cookieLifetimeUnit: z.enum(["day", "week", "month", "year"]),
  commissionType: z.enum(["percentage", "fixed"]),
  commissionValue: z.number().min(0),
  commissionDurationValue: z.number().min(1),
  commissionDurationUnit: z.enum(["day", "week", "month", "year"]),
  currency: z.string().min(1),
});

type CompanySchema = z.infer<typeof companySchema>;

export default function CreateCompany() {
  const form = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      slug: "",
      domainName: "",
      logoUrl: "",
      referralParam: "ref",
      cookieLifetimeValue: 30,
      cookieLifetimeUnit: "day",
      commissionType: "percentage",
      commissionValue: 10,
      commissionDurationValue: 30,
      commissionDurationUnit: "day",
      currency: "USD",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateOrganization,
    onSuccess: () => {
      toast({
        title: "Company created successfully!",
        description: "Your organization is ready to use.",
      });
      router.push("/dashboard");
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error creating company",
        description: err.message ?? "Something went wrong.",
      });
    },
  });

  const onSubmit = (data: CompanySchema) => mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Acme Inc" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="slug"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company URL</FormLabel>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">
                          affiliatex.com/
                        </span>
                        <FormControl>
                          <Input {...field} placeholder="acme-inc" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="domainName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Domain</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="yourcompany.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="logoUrl"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL (optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://cdn.example.com/logo.png"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="referralParam"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referral URL Parameter</FormLabel>
                      <FormControl>
                        <select {...field} className="input">
                          <option value="ref">ref</option>
                          <option value="via">via</option>
                          <option value="aff">aff</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="cookieLifetimeValue"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cookie Lifetime</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="cookieLifetimeUnit"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <select {...field} className="input">
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="commissionType"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commission Type</FormLabel>
                        <FormControl>
                          <select {...field} className="input">
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="commissionValue"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commission Value</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="commissionDurationValue"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commission Duration</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="commissionDurationUnit"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <select {...field} className="input">
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="currency"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <select {...field} className="input">
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="CAD">CAD</option>
                          <option value="AUD">AUD</option>
                        </select>
                      </FormControl>
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
}
