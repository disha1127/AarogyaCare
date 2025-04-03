import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Pill, Clock, Calendar, AlertCircle } from "lucide-react";
import { Medication } from "@shared/schema";

// Types for medication adherence tracking
export interface AdherenceRecord {
  medicationId: number;
  date: string;
  taken: boolean;
  scheduledTime: string;
  actualTime?: string;
}

interface MedicationAdherenceProps {
  medications: Medication[];
  adherenceRecords?: AdherenceRecord[];
}

export default function MedicationAdherence({ medications, adherenceRecords = [] }: MedicationAdherenceProps) {
  const { t } = useLanguage();
  const [adherenceRate, setAdherenceRate] = useState(0);
  const [medicationStats, setMedicationStats] = useState<{
    total: number;
    active: number;
    upcoming: number;
    expired: number;
  }>({
    total: 0,
    active: 0,
    upcoming: 0,
    expired: 0,
  });

  useEffect(() => {
    // Calculate adherence rate
    if (adherenceRecords.length > 0) {
      const takenCount = adherenceRecords.filter(record => record.taken).length;
      setAdherenceRate(Math.round((takenCount / adherenceRecords.length) * 100));
    } else {
      setAdherenceRate(0);
    }

    // Calculate medication statistics
    const today = new Date();
    const stats = {
      total: medications.length,
      active: 0,
      upcoming: 0,
      expired: 0,
    };

    medications.forEach(medication => {
      const startDate = new Date(medication.startDate);
      const endDate = medication.endDate ? new Date(medication.endDate) : null;

      if (startDate > today) {
        stats.upcoming++;
      } else if (endDate && endDate < today) {
        stats.expired++;
      } else if (medication.isActive) {
        stats.active++;
      } else {
        stats.expired++;
      }
    });

    setMedicationStats(stats);
  }, [medications, adherenceRecords]);

  // Get the last week's adherence trend
  const getWeeklyAdherenceTrend = () => {
    // Create an array for the last 7 days
    const today = new Date();
    const lastWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    // Calculate adherence for each day
    return lastWeek.map(date => {
      const dayRecords = adherenceRecords.filter(record => record.date === date);
      if (dayRecords.length === 0) return { date, rate: 0 };
      
      const takenCount = dayRecords.filter(record => record.taken).length;
      return {
        date,
        rate: Math.round((takenCount / dayRecords.length) * 100)
      };
    });
  };

  const weeklyTrend = getWeeklyAdherenceTrend();

  // Get common adherence issues
  const getAdherenceIssues = () => {
    const missedCount = adherenceRecords.filter(record => !record.taken).length;
    const lateCount = adherenceRecords.filter(record => 
      record.taken && record.actualTime && 
      new Date(`2000-01-01T${record.actualTime}`) > new Date(`2000-01-01T${record.scheduledTime}:00`)
    ).length;

    return {
      missed: missedCount,
      late: lateCount,
    };
  };

  const adherenceIssues = getAdherenceIssues();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">
        {t("medicationAdherence", "Medication Adherence Analysis")}
      </h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Pill className="mr-2 h-5 w-5 text-primary-500" />
              {t("totalMedications", "Total Medications")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{medicationStats.total}</div>
            <p className="text-sm text-slate-500 mt-1">
              {t("activeMedications", "Active")}: {medicationStats.active}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-green-500" />
              {t("adherenceRate", "Adherence Rate")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end space-x-1">
              <div className="text-3xl font-bold">{adherenceRate}%</div>
              <div className="text-sm text-slate-500 mb-1">
                {t("last30Days", "last 30 days")}
              </div>
            </div>
            <Progress className="mt-2" value={adherenceRate} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-amber-500" />
              {t("upcomingMedications", "Upcoming")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{medicationStats.upcoming}</div>
            <p className="text-sm text-slate-500 mt-1">
              {t("scheduledToStart", "Scheduled to start soon")}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              {t("missedDoses", "Missed Doses")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{adherenceIssues.missed}</div>
            <p className="text-sm text-slate-500 mt-1">
              {t("lateDoses", "Late doses")}: {adherenceIssues.late}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("weeklyTrend", "Weekly Trend")}</CardTitle>
            <CardDescription>
              {t("weeklyTrendDescription", "Your medication adherence over the last 7 days")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-44">
              <div className="absolute inset-0 flex items-end">
                {weeklyTrend.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full px-1">
                      <div 
                        className={`w-full bg-primary-100 rounded-t-sm ${
                          day.rate >= 80 ? 'bg-green-100' : 
                          day.rate >= 50 ? 'bg-amber-100' : 
                          'bg-red-100'
                        }`}
                        style={{ height: `${Math.max(day.rate, 5)}%` }}
                      >
                        <div 
                          className={`w-full h-full rounded-t-sm ${
                            day.rate >= 80 ? 'bg-green-500' : 
                            day.rate >= 50 ? 'bg-amber-500' : 
                            'bg-red-500'
                          }`}
                          style={{ opacity: 0.7 }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {formatDate(day.date)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Y-axis labels */}
              <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-between text-xs text-slate-400 pr-2">
                <div>100%</div>
                <div>75%</div>
                <div>50%</div>
                <div>25%</div>
                <div>0%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("adherenceInsights", "Adherence Insights")}</CardTitle>
            <CardDescription>
              {t("adherenceInsightsDescription", "Actionable recommendations to improve your medication adherence")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adherenceRate < 80 && (
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 mt-1">
                    {t("insight", "Insight")}
                  </Badge>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">{t("lowAdherenceRate", "Low Adherence Rate")}</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      {t("lowAdherenceRateDesc", "Your adherence rate is below 80%. Set reminders or use pill organizers to improve consistency.")}
                    </p>
                  </div>
                </div>
              )}
              
              {adherenceIssues.late > 0 && (
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 mt-1">
                    {t("pattern", "Pattern")}
                  </Badge>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">{t("lateDosePattern", "Late Dose Pattern")}</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      {t("lateDosePatternDesc", "You often take your medications later than scheduled. Try setting earlier reminders.")}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 mt-1">
                  {t("tip", "Tip")}
                </Badge>
                <div>
                  <h4 className="text-sm font-medium text-slate-900">{t("consistencyTip", "Consistency Tip")}</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {t("consistencyTipDesc", "Take medications at the same time each day to build a routine. Connect it with daily activities like brushing teeth.")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 mt-1">
                  {t("tip", "Tip")}
                </Badge>
                <div>
                  <h4 className="text-sm font-medium text-slate-900">{t("supportTip", "Support Tip")}</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {t("supportTipDesc", "Ask a family member to help remind you about medications when you're likely to forget.")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}