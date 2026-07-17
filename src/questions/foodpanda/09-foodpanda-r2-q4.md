---
company: "foodpanda"
id: "foodpanda-r2-q4"
order: 9
label: "FoodPanda R2 — Question 4"
labelStyle: "background:#1e3a5f; color:#60a5fa;"
navLabel: "· Count Sunday 1sts"
title: "Count Sundays Falling on 1st of Month (1900–2000)"
---

::: problem Problem
<p>No libraries allowed. Count how many times the 1st of a month fell on a Sunday between 1 Jan 1900 and 31 Dec 2000 inclusive. Given: 1 Jan 1900 was a Monday.</p>
    <p style="margin-top:8px;">Leap year rule: divisible by 4, <span class="highlight">except</span> centuries — unless also divisible by 400.</p>
:::

::: tldr
<p>💡 Track a running day counter (0–6). Advance by days in each month mod 7. If 1st of month = Sunday (0), count it.</p>
:::

::: steps How to solve
<ol class="step-list">
      <li>Start <code>day = 1</code> (Monday). Use 0=Sun, 1=Mon … 6=Sat.</li>
      <li>Loop every year 1900–2000, every month 1–12.</li>
      <li>If <code>day == 0</code> → it's a Sunday → increment count.</li>
      <li>Advance: <code>day = (day + days_in_month) % 7</code>.</li>
      <li>Handle leap year in <code>days_in_month</code> for February.</li>
    </ol>
:::

::: code Final code


```python
def count_sundays():
    month_days = [31,28,31,30,31,30,31,31,30,31,30,31]

    def is_leap(year):
        if year % 400 == 0: return True
        if year % 100 == 0: return False
        if year % 4   == 0: return True
        return False

    def days_in_month(month, year):
        if month == 2 and is_leap(year):
            return 29
        return month_days[month - 1]

    # 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
    day = 1  # 1 Jan 1900 = Monday
    count = 0

    for year in range(1900, 2001):
        for month in range(1, 13):
            if day == 0:  # 1st of this month is Sunday
                count += 1
            day = (day + days_in_month(month, year)) % 7

    return count  # answer: 171
```


:::

::: remember Key details
<p><span class="highlight">Why mod 7?</span> Days cycle every 7 — mod keeps it in range 0–6 forever.</p>
    <p style="margin-top:8px;"><span class="highlight">Leap year order matters:</span> check 400 first, then 100, then 4. If you check 4 first you'd incorrectly mark century years as leap.</p>
    <p style="margin-top:8px;"><span class="highlight">Answer is 171.</span></p>
:::

