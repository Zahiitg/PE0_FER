import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 data-testid="home-title" className="text-4xl font-extrabold tracking-tight mb-4">
          SpendWise
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Take control of your personal finances with simple, effective expense tracking and insightful category breakdowns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add expenses</CardTitle>
            <CardDescription>
              Quickly record your daily expenses with amount, category, date, and notes.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filter by month</CardTitle>
            <CardDescription>
              Easily filter your spending records by category and specific month to track budget history.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>See where money goes</CardTitle>
            <CardDescription>
              View instant summary totals and an ordered breakdown of expenses by category.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
