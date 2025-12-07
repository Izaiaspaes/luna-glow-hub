import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase } from "lucide-react";
import { useWorkTracking } from "@/hooks/useWorkTracking";
import { useTranslation } from "react-i18next";

const getWorkFormSchema = (t: (key: string) => string) => z.object({
  work_date: z.date({
    required_error: t("forms.work.dateRequired"),
  }),
  routine_type: z.enum(['fixed', 'variable', 'shift'], {
    required_error: t("forms.work.routineRequired"),
  }),
  hours_worked: z.number({
    required_error: t("forms.work.hoursRequired"),
  }).min(0).max(24),
  shift_type: z.enum(['day', 'night', 'mixed', 'off']).optional(),
  notes: z.string().optional(),
});

type WorkFormValues = z.infer<ReturnType<typeof getWorkFormSchema>>;

export function WorkForm() {
  const { t } = useTranslation();
  const { saveWorkData } = useWorkTracking();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WorkFormValues>({
    resolver: zodResolver(getWorkFormSchema(t)),
    defaultValues: {
      work_date: new Date(),
      routine_type: 'fixed',
      hours_worked: 8,
      shift_type: 'day',
      notes: '',
    },
  });

  const onSubmit = async (values: WorkFormValues) => {
    setIsSubmitting(true);
    try {
      await saveWorkData({
        work_date: values.work_date.toISOString().split('T')[0],
        routine_type: values.routine_type,
        hours_worked: values.hours_worked,
        shift_type: values.shift_type,
        notes: values.notes,
      });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4 md:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Briefcase className="h-5 w-5" />
          {t("forms.work.title")}
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          {t("forms.work.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 md:space-y-4">
            <FormField
              control={form.control}
              name="work_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-base md:text-sm font-medium">{t("forms.work.date")}</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      disabled={(date) => date > new Date()}
                      placeholder={t("forms.work.selectDate")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="routine_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-sm font-medium">{t("forms.work.routineType")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 md:h-10 text-base md:text-sm">
                        <SelectValue placeholder={t("forms.work.routinePlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixed" className="py-3 md:py-2 text-base md:text-sm">{t("forms.work.routineFixed")}</SelectItem>
                      <SelectItem value="variable" className="py-3 md:py-2 text-base md:text-sm">{t("forms.work.routineVariable")}</SelectItem>
                      <SelectItem value="shift" className="py-3 md:py-2 text-base md:text-sm">{t("forms.work.routineShift")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hours_worked"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-sm font-medium">{t("forms.work.hoursWorked")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      placeholder="8"
                      className="h-12 md:h-10 text-base md:text-sm px-4"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shift_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-sm font-medium">{t("forms.work.shiftType")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 md:h-10 text-base md:text-sm">
                        <SelectValue placeholder={t("forms.work.shiftPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="day" className="py-3 md:py-2 text-base md:text-sm">{t("forms.work.shiftDay")}</SelectItem>
                      <SelectItem value="night" className="py-3 md:py-2 text-base md:text-sm">{t("forms.work.shiftNight")}</SelectItem>
                      <SelectItem value="mixed" className="py-3 md:py-2 text-base md:text-sm">{t("forms.work.shiftMixed")}</SelectItem>
                      <SelectItem value="off" className="py-3 md:py-2 text-base md:text-sm">{t("forms.work.shiftOff")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-sm font-medium">{t("forms.work.notes")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("forms.work.notesPlaceholder")}
                      className="min-h-[100px] md:min-h-[80px] text-base md:text-sm p-4 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-12 md:h-10 text-base md:text-sm font-medium mt-2" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t("forms.work.saving") : t("forms.work.save")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
