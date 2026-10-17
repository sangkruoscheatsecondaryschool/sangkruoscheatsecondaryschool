"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { StatisticsData } from "@/lib/admin/reports/statistics";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"];
const GENDER_COLORS = ["#3b82f6", "#ec4899"]; // Blue for male, Pink for female

export function StatisticsDashboard({ data }: { data: StatisticsData }) {
  // Format data for charts
  const genderData = [
    { name: "ប្រុស", value: data.students.reduce((acc, curr) => acc + curr.male, 0) },
    { name: "ស្រី", value: data.students.reduce((acc, curr) => acc + curr.female, 0) },
  ];

  const gradeData = [
    { name: "ថ្នាក់ទី 7", total: data.students.find((s) => s.grade_level === 7)?.total || 0 },
    { name: "ថ្នាក់ទី 8", total: data.students.find((s) => s.grade_level === 8)?.total || 0 },
    { name: "ថ្នាក់ទី 9", total: data.students.find((s) => s.grade_level === 9)?.total || 0 },
  ];

  const letterGradesData = Object.entries(data.grades).map(([letter, count]) => ({
    name: letter,
    count,
  }));

  const totalStudents = data.students.reduce((acc, curr) => acc + curr.total, 0);
  const totalGrades = Object.values(data.grades).reduce((acc, curr) => acc + curr, 0);
  const passCount = totalGrades - data.grades.F;
  const passRate = totalGrades > 0 ? ((passCount / totalGrades) * 100).toFixed(1) : "0";

  const totalAtt = data.attendance.present + data.attendance.permission + data.attendance.unpermitted;
  const presentRate = totalAtt > 0 ? ((data.attendance.present / totalAtt) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6 print:space-y-4 print:text-black">
      
      {/* ===== Summary Cards ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard title="សិស្សសរុប" value={totalStudents.toString()} />
        <SummaryCard title="គ្រូបង្រៀនសរុប" value={data.teachers.total.toString()} />
        <SummaryCard title="អត្រាជាប់" value={`${passRate}%`} tone="green" />
        <SummaryCard title="អត្រាវត្តមាន" value={`${presentRate}%`} tone="blue" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
        {/* ===== Student by Grade ===== */}
        <div className="rounded-card border border-border bg-surface p-4 print:border-none print:p-0">
          <h3 className="font-moul text-sm mb-4 text-center">ចំនួនសិស្សតាមកម្រិតថ្នាក់</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== Gender Pie Chart ===== */}
        <div className="rounded-card border border-border bg-surface p-4 print:border-none print:p-0">
          <h3 className="font-moul text-sm mb-4 text-center">សមាមាត្រភេទសិស្ស</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== Grade Distribution ===== */}
        <div className="rounded-card border border-border bg-surface p-4 print:border-none print:p-0">
          <h3 className="font-moul text-sm mb-4 text-center">ការចែកចាយនិទ្ទេស (ប្រចាំឆ្នាំ)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={letterGradesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {letterGradesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== Teacher Gender ===== */}
        <div className="rounded-card border border-border bg-surface p-4 print:border-none print:p-0">
          <h3 className="font-moul text-sm mb-4 text-center">សមាមាត្រភេទគ្រូបង្រៀន</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "ប្រុស", value: data.teachers.male },
                    { name: "ស្រី", value: data.teachers.female },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  tone = "gray",
}: {
  title: string;
  value: string;
  tone?: "gray" | "green" | "blue";
}) {
  const cls =
    tone === "green"
      ? "border-green-200 bg-green-50 text-green-800"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-800"
        : "border-border bg-surface";

  return (
    <div className={`rounded-card border ${cls} p-4 text-center print:border-gray-300`}>
      <p className="text-[11px] uppercase tracking-wide opacity-80">{title}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}