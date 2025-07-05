export interface Story {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  author: string;
  readTime: string;
  publishDate: string;
  category: string;
  document_id?: string;
  visuals?: {
    id: string;
    title: string;
    type: string;
    description: string;
    x_axis: string;
    y_axis: string;
    source: string;
  }[];
  visual_data?: Array<{
    source_file: string;
    description: string;
    chart_type?: string;
    time_period?: "past" | "present" | "future";
    data_sample: Array<Record<string, any>>;
  }>;
  sections: {
    heading: string;
    content: string;
  }[];
}

export const stories: Story[] = [
  {
    id: "germany-france-energy-puzzle",
    title:
      "The Price Divide – How Germany and France Navigate Europe's Energy Puzzle",
    subtitle: "Diverging Costs and Policy Paths in a Shared Market",
    author: "Energy Policy Team",
    readTime: "12 min read",
    publishDate: "2024-01-20",
    category: "Energy",
    intro:
      "Europe's energy shock is no longer just a macroeconomic concern—it's a lived experience shaping household budgets and political alliances. While France leans on nuclear stability, Germany's industrial model is tested by fossil phase-outs and volatile gas prices. This story compares their economic resilience and how policies affect different income groups.",
    sections: [
      {
        heading: "I. The Past: From Cheap Gas to Price Shocks",
        content:
          "Before 2021, Germany relied heavily on low-cost Russian gas, enabling both affordable heating and export competitiveness. Meanwhile, France's nuclear base allowed stable electricity prices. As the Ukraine war escalated, energy prices surged—Germany saw heating costs triple for lower-income households (see fig_1_heating_expenditure_data.csv), with 4.5% of income spent on energy by the bottom decile.",
      },
      {
        heading: "II. The Present: Households Bear Unequal Burdens",
        content:
          "While energy inflation eased by late 2023, the structural gap persisted. Heating costs still make up over 3% of income for Germany's lowest-income renters. Meanwhile, homeowners with better insulation saw less impact (see fig_5_tenants_owners_efficiency_income.csv). Germany's private consumption lags behind EU peers (see Fig_4_2_germany_private_consumption_data.csv), indicating eroded household confidence.",
      },
      {
        heading: "III. The Future: Resilience or Fragmentation?",
        content:
          "Forecasts for 2024–2026 suggest recovery in German GDP (see fig_3_germany_gdp_growth_forecast_data.csv), but with consumption and investment divided across income lines. If energy transition subsidies remain flat-rate, the poorest will bear a disproportionate cost of decarbonization—despite contributing least to emissions.",
      },
      {
        heading: "Conclusion",
        content:
          "Energy shocks have split Europe along socio-economic lines. France and Germany exemplify diverging paths: nuclear stability vs. fossil exposure. Without targeted compensation, climate policy may become politically unsustainable.",
      },
    ],
    visual_data: [
      {
        source_file: "fig_1_global_gdp_growth_quarterly_data.csv",
        description:
          "Tracks GDP growth across advanced economies from 2015 to 2023, illustrating global context of post-COVID economic resilience.",
        chart_type: "line",
        time_period: "future",
        data_sample: [
          {
            Quarter: "2023Q1",
            Emerging_Economies_QoQ: 1.2,
            Advanced_Economies_QoQ: 0.2,
            World_Index_2015Q1_100: 133.0,
          },
          {
            Quarter: "2023Q2",
            Emerging_Economies_QoQ: 0.95,
            Advanced_Economies_QoQ: 0.15,
            World_Index_2015Q1_100: 134.5,
          },
          {
            Quarter: "2023Q3",
            Emerging_Economies_QoQ: 1.15,
            Advanced_Economies_QoQ: 0.25,
            World_Index_2015Q1_100: 136.0,
          },
          {
            Quarter: "2023Q4",
            Emerging_Economies_QoQ: 0.95,
            Advanced_Economies_QoQ: 0.15,
            World_Index_2015Q1_100: 137.5,
          },
          {
            Quarter: "2024Q1",
            Emerging_Economies_QoQ: 1.05,
            Advanced_Economies_QoQ: 0.1,
            World_Index_2015Q1_100: 139.0,
          },
          {
            Quarter: "2024Q2",
            Emerging_Economies_QoQ: 0.7,
            Advanced_Economies_QoQ: 0.15,
            World_Index_2015Q1_100: 140.0,
          },
          {
            Quarter: "2024Q3",
            Emerging_Economies_QoQ: 0.85,
            Advanced_Economies_QoQ: 0.2,
            World_Index_2015Q1_100: 141.0,
          },
          {
            Quarter: "2024Q4",
            Emerging_Economies_QoQ: 0.8,
            Advanced_Economies_QoQ: 0.1,
            World_Index_2015Q1_100: 142.0,
          },
          {
            Quarter: "2025Q1",
            Emerging_Economies_QoQ: 0.9,
            Advanced_Economies_QoQ: 0.15,
            World_Index_2015Q1_100: 143.5,
          },
          {
            Quarter: "2025Q2",
            Emerging_Economies_QoQ: 0.85,
            Advanced_Economies_QoQ: 0.1,
            World_Index_2015Q1_100: 145.0,
          },
        ],
      },
      {
        source_file: "fig_2_euro_area_real_wages_data.csv",
        description:
          "Shows real wages indexed by country, useful for comparing income recovery and purchasing power.",
        chart_type: "line",
        time_period: "past",
        data_sample: [
          {
            Period: "2017Q1",
            Euro_area: 102.5,
            Germany: 98.5,
            France: 102.5,
            Italy: 96.5,
            Spain: 98.5,
          },
          {
            Period: "2017Q2",
            Euro_area: 102.7,
            Germany: 98.5,
            France: 102.8,
            Italy: 97.0,
            Spain: 98.7,
          },
          {
            Period: "2017Q3",
            Euro_area: 102.8,
            Germany: 98.5,
            France: 103.0,
            Italy: 97.5,
            Spain: 98.8,
          },
          {
            Period: "2017Q4",
            Euro_area: 103.0,
            Germany: 98.7,
            France: 103.2,
            Italy: 98.0,
            Spain: 99.0,
          },
          {
            Period: "2018Q1",
            Euro_area: 102.5,
            Germany: 98.0,
            France: 102.5,
            Italy: 98.5,
            Spain: 99.5,
          },
          {
            Period: "2018Q2",
            Euro_area: 102.3,
            Germany: 97.5,
            France: 102.3,
            Italy: 99.0,
            Spain: 100.0,
          },
          {
            Period: "2018Q3",
            Euro_area: 102.2,
            Germany: 97.5,
            France: 102.0,
            Italy: 99.5,
            Spain: 100.2,
          },
          {
            Period: "2018Q4",
            Euro_area: 102.0,
            Germany: 97.8,
            France: 101.5,
            Italy: 100.0,
            Spain: 100.5,
          },
          {
            Period: "2019Q1",
            Euro_area: 101.5,
            Germany: 98.5,
            France: 101.0,
            Italy: 100.5,
            Spain: 100.8,
          },
          {
            Period: "2019Q2",
            Euro_area: 101.0,
            Germany: 99.0,
            France: 100.5,
            Italy: 100.8,
            Spain: 101.0,
          },
        ],
      },
      {
        source_file: "fig_3_germany_gdp_growth_forecast_data.csv",
        description:
          "Forecast of German GDP trends, showing economic recovery and future expectations.",
        chart_type: "line",
        time_period: "future",
        data_sample: [
          {
            Quarter: "2023Q1",
            GDP_Level_Billions_EUR: 910.5,
            Quarterly_Growth_Rate_Percent: -0.1,
          },
          {
            Quarter: "2023Q2",
            GDP_Level_Billions_EUR: 909.5,
            Quarterly_Growth_Rate_Percent: -0.1,
          },
          {
            Quarter: "2023Q3",
            GDP_Level_Billions_EUR: 908.5,
            Quarterly_Growth_Rate_Percent: -0.1,
          },
          {
            Quarter: "2023Q4",
            GDP_Level_Billions_EUR: 910.0,
            Quarterly_Growth_Rate_Percent: 0.2,
          },
          {
            Quarter: "2024Q1",
            GDP_Level_Billions_EUR: 909.5,
            Quarterly_Growth_Rate_Percent: -0.1,
          },
          {
            Quarter: "2024Q2",
            GDP_Level_Billions_EUR: 909.5,
            Quarterly_Growth_Rate_Percent: 0.0,
          },
          {
            Quarter: "2024Q3",
            GDP_Level_Billions_EUR: 910.5,
            Quarterly_Growth_Rate_Percent: 0.1,
          },
          {
            Quarter: "2024Q4",
            GDP_Level_Billions_EUR: 911.0,
            Quarterly_Growth_Rate_Percent: 0.1,
          },
          {
            Quarter: "2025Q1",
            GDP_Level_Billions_EUR: 912.0,
            Quarterly_Growth_Rate_Percent: 0.1,
          },
          {
            Quarter: "2025Q2",
            GDP_Level_Billions_EUR: 913.0,
            Quarterly_Growth_Rate_Percent: 0.1,
          },
        ],
      },
      {
        source_file: "Fig_4_1_germany_gdp_output_gap_data.csv",
        description:
          "Indicates the economic slack or overheating in Germany's economy after COVID.",
        chart_type: "bar",
        time_period: "future",
        data_sample: [
          {
            Year: 2021,
            GDP_Billions_EUR: 3570,
            Potential_GDP_Billions_EUR: 3615,
            Output_Gap_Percent: -1.0,
          },
          {
            Year: 2022,
            GDP_Billions_EUR: 3625,
            Potential_GDP_Billions_EUR: 3640,
            Output_Gap_Percent: -0.4,
          },
          {
            Year: 2023,
            GDP_Billions_EUR: 3615,
            Potential_GDP_Billions_EUR: 3665,
            Output_Gap_Percent: -1.4,
          },
          {
            Year: 2024,
            GDP_Billions_EUR: 3615,
            Potential_GDP_Billions_EUR: 3685,
            Output_Gap_Percent: -1.9,
          },
          {
            Year: 2025,
            GDP_Billions_EUR: 3650,
            Potential_GDP_Billions_EUR: 3705,
            Output_Gap_Percent: -1.5,
          },
          {
            Year: 2026,
            GDP_Billions_EUR: 3700,
            Potential_GDP_Billions_EUR: 3720,
            Output_Gap_Percent: -0.5,
          },
        ],
      },
      {
        source_file: "Fig_4_2_germany_private_consumption_data.csv",
        description:
          "Illustrates household consumption trends post-COVID, showing domestic demand recovery.",
        chart_type: "area",
        time_period: "present",
        data_sample: [
          {
            Quarter: "2021Q1",
            Consumption_Level_Index: 425,
            Quarterly_Growth_Rate_Percent: -3.5,
          },
          {
            Quarter: "2021Q2",
            Consumption_Level_Index: 450,
            Quarterly_Growth_Rate_Percent: 2.5,
          },
          {
            Quarter: "2021Q3",
            Consumption_Level_Index: 460,
            Quarterly_Growth_Rate_Percent: 2.0,
          },
          {
            Quarter: "2021Q4",
            Consumption_Level_Index: 465,
            Quarterly_Growth_Rate_Percent: 1.2,
          },
          {
            Quarter: "2022Q1",
            Consumption_Level_Index: 470,
            Quarterly_Growth_Rate_Percent: 0.9,
          },
          {
            Quarter: "2022Q2",
            Consumption_Level_Index: 475,
            Quarterly_Growth_Rate_Percent: 0.9,
          },
          {
            Quarter: "2022Q3",
            Consumption_Level_Index: 463,
            Quarterly_Growth_Rate_Percent: -2.0,
          },
          {
            Quarter: "2022Q4",
            Consumption_Level_Index: 450,
            Quarterly_Growth_Rate_Percent: -1.5,
          },
          {
            Quarter: "2023Q1",
            Consumption_Level_Index: 449,
            Quarterly_Growth_Rate_Percent: -0.1,
          },
          {
            Quarter: "2023Q2",
            Consumption_Level_Index: 459,
            Quarterly_Growth_Rate_Percent: 1.0,
          },
        ],
      },
      {
        source_file: "fig_1_heating_expenditure_data.csv",
        description:
          "Shows energy cost burdens by income decile, core to the energy vulnerability aspect of the story.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          {
            Income_Decile: 1,
            "50th_Percentile": 11.0,
            "75th_Percentile": 17.0,
            "90th_Percentile": 23.0,
          },
          {
            Income_Decile: 2,
            "50th_Percentile": 8.5,
            "75th_Percentile": 13.0,
            "90th_Percentile": 18.0,
          },
          {
            Income_Decile: 3,
            "50th_Percentile": 7.5,
            "75th_Percentile": 11.5,
            "90th_Percentile": 16.0,
          },
          {
            Income_Decile: 4,
            "50th_Percentile": 6.8,
            "75th_Percentile": 10.5,
            "90th_Percentile": 14.5,
          },
          {
            Income_Decile: 5,
            "50th_Percentile": 6.2,
            "75th_Percentile": 9.8,
            "90th_Percentile": 13.0,
          },
          {
            Income_Decile: 6,
            "50th_Percentile": 5.8,
            "75th_Percentile": 9.2,
            "90th_Percentile": 12.0,
          },
          {
            Income_Decile: 7,
            "50th_Percentile": 5.5,
            "75th_Percentile": 8.8,
            "90th_Percentile": 11.2,
          },
          {
            Income_Decile: 8,
            "50th_Percentile": 5.2,
            "75th_Percentile": 8.5,
            "90th_Percentile": 10.8,
          },
          {
            Income_Decile: 9,
            "50th_Percentile": 4.9,
            "75th_Percentile": 8.2,
            "90th_Percentile": 10.5,
          },
          {
            Income_Decile: 10,
            "50th_Percentile": 4.6,
            "75th_Percentile": 7.8,
            "90th_Percentile": 10.0,
          },
        ],
      },
      {
        source_file: "fig_5_tenants_owners_efficiency_income.csv",
        description:
          "Links building energy efficiency to income groups and tenure, reflecting structural inequalities.",
        chart_type: "pie",
        time_period: "present",
        data_sample: [
          {
            name: "Inefficient Owners (Above Wohngeld)",
            value: 23,
            category: "owners",
          },
          {
            name: "Inefficient Owners (Below Wohngeld)",
            value: 8,
            category: "owners",
          },
          {
            name: "Inefficient Tenants (Above Wohngeld)",
            value: 12,
            category: "tenants",
          },
          {
            name: "Inefficient Tenants (Below Wohngeld)",
            value: 13,
            category: "tenants",
          },
          {
            name: "Very Inefficient Owners (Above Wohngeld)",
            value: 25,
            category: "owners",
          },
          {
            name: "Very Inefficient Owners (Below Wohngeld)",
            value: 5,
            category: "owners",
          },
          {
            name: "Very Inefficient Tenants (Above Wohngeld)",
            value: 3,
            category: "tenants",
          },
          {
            name: "Very Inefficient Tenants (Below Wohngeld)",
            value: 16,
            category: "tenants",
          },
        ],
      },
    ],
  },
  {
    id: "gender-gaps-reshaped-economy",
    title: "Unequal Burdens: Gender Gaps in a Reshaped Economy",
    subtitle:
      "Tracing how structural shifts and crises have intensified the economic divide for women",
    author: "Gender Economics Team",
    readTime: "10 min read",
    publishDate: "2024-02-15",
    category: "Gender Economics",
    intro:
      "The economic aftermath of the COVID-19 pandemic and the ongoing cost-of-living pressures have exacerbated existing gender disparities in income, labor market participation, and access to energy-efficient housing. While some recovery is evident in macroeconomic indicators, the uneven benefits highlight persistent structural inequalities affecting women.",
    sections: [
      {
        heading: "Past: Pre-Crisis Disparities",
        content:
          "Even before recent crises, gender-based income disparities were evident. Women were more likely to be in part-time or lower-wage roles, with fewer opportunities for career advancement. In the housing sector, women—especially single mothers and elderly women—had reduced access to energy-efficient homes, increasing their vulnerability to rising utility costs.",
      },
      {
        heading: "Present: Inflation and Energy Burdens",
        content:
          "Recent inflationary pressures have deepened the economic strain on women. Real wages have declined more sharply in female-dominated sectors. Additionally, heating and housing costs continue to rise, disproportionately affecting low-income women who often reside in rental properties with poor energy efficiency. Evidence shows a clear link between household income decile and exposure to inefficient housing, reflecting compounding disadvantage.",
      },
      {
        heading: "Future: Addressing Structural Inequities",
        content:
          "Policy responses must prioritize inclusive growth strategies. Investment in affordable, energy-efficient housing targeted at lower-income households—where women are overrepresented—is crucial. Similarly, wage recovery and job security in sectors with high female employment should be a policy focus. Without targeted reforms, structural gaps will persist, limiting economic resilience and gender equity in the long term.",
      },
    ],
    visual_data: [
      {
        source_file: "gender_income_inequality_data.csv",
        description:
          "Shows income inequality metrics by gender over time, highlighting persistent disparities.",
        chart_type: "line",
        time_period: "past",
        data_sample: [
          {
            Year: 2010,
            Gini_Coefficient: 0.392,
            P90_P10_Ratio: 11.4,
            P50_P10_Ratio: 5.45,
          },
          {
            Year: 2011,
            Gini_Coefficient: 0.393,
            P90_P10_Ratio: 11.4,
            P50_P10_Ratio: 5.45,
          },
          {
            Year: 2012,
            Gini_Coefficient: 0.389,
            P90_P10_Ratio: 11.35,
            P50_P10_Ratio: 5.4,
          },
          {
            Year: 2013,
            Gini_Coefficient: 0.394,
            P90_P10_Ratio: 11.5,
            P50_P10_Ratio: 5.5,
          },
          {
            Year: 2014,
            Gini_Coefficient: 0.389,
            P90_P10_Ratio: 11.55,
            P50_P10_Ratio: 5.48,
          },
          {
            Year: 2015,
            Gini_Coefficient: 0.388,
            P90_P10_Ratio: 11.45,
            P50_P10_Ratio: 5.42,
          },
          {
            Year: 2016,
            Gini_Coefficient: 0.387,
            P90_P10_Ratio: 11.35,
            P50_P10_Ratio: 5.35,
          },
          {
            Year: 2017,
            Gini_Coefficient: 0.385,
            P90_P10_Ratio: 11.15,
            P50_P10_Ratio: 5.28,
          },
          {
            Year: 2018,
            Gini_Coefficient: 0.383,
            P90_P10_Ratio: 10.9,
            P50_P10_Ratio: 5.15,
          },
          {
            Year: 2019,
            Gini_Coefficient: 0.38,
            P90_P10_Ratio: 10.85,
            P50_P10_Ratio: 5.1,
          },
          {
            Year: 2020,
            Gini_Coefficient: 0.372,
            P90_P10_Ratio: 10.65,
            P50_P10_Ratio: 5.0,
          },
          {
            Year: 2021,
            Gini_Coefficient: 0.373,
            P90_P10_Ratio: 10.6,
            P50_P10_Ratio: 4.9,
          },
          {
            Year: 2022,
            Gini_Coefficient: 0.382,
            P90_P10_Ratio: 10.75,
            P50_P10_Ratio: 4.82,
          },
          {
            Year: 2023,
            Gini_Coefficient: 0.385,
            P90_P10_Ratio: 10.4,
            P50_P10_Ratio: 4.78,
          },
          {
            Year: 2024,
            Gini_Coefficient: 0.387,
            P90_P10_Ratio: 10.65,
            P50_P10_Ratio: 4.92,
          },
        ],
      },
      {
        source_file: "housing_efficiency_income_data.csv",
        description:
          "Illustrates the distribution of housing efficiency by household type and income level.",
        chart_type: "pie",
        time_period: "present",
        data_sample: [
          {
            Efficiency_Category: "Inefficient",
            Household_Type: "Owners",
            Income_Level: "Above Wohngeld-Plus",
            Percent_of_All_Households: 23,
          },
          {
            Efficiency_Category: "Inefficient",
            Household_Type: "Owners",
            Income_Level: "Below Wohngeld-Plus",
            Percent_of_All_Households: 8,
          },
          {
            Efficiency_Category: "Inefficient",
            Household_Type: "Tenants",
            Income_Level: "Above Wohngeld-Plus",
            Percent_of_All_Households: 12,
          },
          {
            Efficiency_Category: "Inefficient",
            Household_Type: "Tenants",
            Income_Level: "Below Wohngeld-Plus",
            Percent_of_All_Households: 13,
          },
          {
            Efficiency_Category: "Very inefficient",
            Household_Type: "Owners",
            Income_Level: "Above Wohngeld-Plus",
            Percent_of_All_Households: 25,
          },
          {
            Efficiency_Category: "Very inefficient",
            Household_Type: "Owners",
            Income_Level: "Below Wohngeld-Plus",
            Percent_of_All_Households: 5,
          },
          {
            Efficiency_Category: "Very inefficient",
            Household_Type: "Tenants",
            Income_Level: "Above Wohngeld-Plus",
            Percent_of_All_Households: 3,
          },
          {
            Efficiency_Category: "Very inefficient",
            Household_Type: "Tenants",
            Income_Level: "Below Wohngeld-Plus",
            Percent_of_All_Households: 16,
          },
        ],
      },
      {
        source_file: "euro_area_real_wages_data.csv",
        description:
          "Tracks real wage trends across Euro area countries, showing gender disparities in wage recovery.",
        chart_type: "line",
        time_period: "present",
        data_sample: [
          {
            Period: "2017Q1",
            Euro_area: 102.5,
            Germany: 98.5,
            France: 102.5,
            Italy: 96.5,
            Spain: 98.5,
            Netherlands: 98.5,
          },
          {
            Period: "2017Q2",
            Euro_area: 102.7,
            Germany: 98.5,
            France: 102.8,
            Italy: 97.0,
            Spain: 98.7,
            Netherlands: 98.7,
          },
          {
            Period: "2017Q3",
            Euro_area: 102.8,
            Germany: 98.5,
            France: 103.0,
            Italy: 97.5,
            Spain: 98.8,
            Netherlands: 98.8,
          },
          {
            Period: "2017Q4",
            Euro_area: 103.0,
            Germany: 98.7,
            France: 103.2,
            Italy: 98.0,
            Spain: 99.0,
            Netherlands: 99.0,
          },
          {
            Period: "2018Q1",
            Euro_area: 102.5,
            Germany: 98.0,
            France: 102.5,
            Italy: 98.5,
            Spain: 99.5,
            Netherlands: 99.5,
          },
          {
            Period: "2018Q2",
            Euro_area: 102.3,
            Germany: 97.5,
            France: 102.3,
            Italy: 99.0,
            Spain: 100.0,
            Netherlands: 100.0,
          },
          {
            Period: "2018Q3",
            Euro_area: 102.2,
            Germany: 97.5,
            France: 102.0,
            Italy: 99.5,
            Spain: 100.2,
            Netherlands: 100.3,
          },
          {
            Period: "2018Q4",
            Euro_area: 102.0,
            Germany: 97.8,
            France: 101.5,
            Italy: 100.0,
            Spain: 100.5,
            Netherlands: 100.5,
          },
          {
            Period: "2019Q1",
            Euro_area: 101.5,
            Germany: 98.5,
            France: 101.0,
            Italy: 100.5,
            Spain: 100.8,
            Netherlands: 100.8,
          },
          {
            Period: "2019Q2",
            Euro_area: 101.0,
            Germany: 99.0,
            France: 100.5,
            Italy: 100.8,
            Spain: 101.0,
            Netherlands: 101.0,
          },
        ],
      },
    ],
  },
  {
    id: "educational-inequity-post-pandemic",
    title:
      "Educational Inequity Post-Pandemic: Long-Term Scars in Skill Development",
    subtitle:
      "How COVID-19 reshaped education, income, and satisfaction in Germany",
    author: "Education Policy Team",
    readTime: "15 min read",
    publishDate: "2024-03-10",
    category: "Education",
    intro:
      "The COVID-19 pandemic has left lasting effects on education, income, and satisfaction in Germany. Using data from DIW Weekly Reports 29, 32, and 43, this story highlights how disrupted parental employment, ideal working hours, and financial relief through climate policy intersect to shape Germany's socio-economic landscape. The data reveals a multi-dimensional inequality across education, income, burden relief, and life satisfaction.",
    sections: [
      {
        heading: "Parental Employment and Education Disparities",
        content:
          "The pandemic exacerbated existing inequalities in parental employment across education levels. Western Germany shows higher reliance on traditional employment models, while Eastern Germany demonstrates more diverse patterns. The male breadwinner model remains prevalent for families with toddlers (23% in West, 13% in East), but education levels significantly impact employment opportunities and household income structures.",
      },
      {
        heading: "The Gap Between Ideal and Actual Employment",
        content:
          "Mothers and fathers face significant discrepancies between their ideal and actual working hours. The data reveals that higher-educated parents tend to have larger gaps between desired and actual employment, particularly in Western Germany. This mismatch contributes to lower work satisfaction scores, especially among women in part-time roles who would prefer full-time employment.",
      },
      {
        heading: "Income and Satisfaction Impacts",
        content:
          "Household income varies dramatically by education level and employment model, with the adult worker model showing the highest net income (€4,861/month) compared to the male breadwinner model (€2,941/month). These income differences directly correlate with income satisfaction scores, which have shown slower recovery for less-educated households post-pandemic.",
      },
      {
        heading: "Climate Policy and Financial Relief",
        content:
          "The climate dividend policy shows unequal distributional effects across income deciles. While lower-income households (1st decile) see a net gain of 0.2%, higher-income households (10th decile) experience a net loss of 0.9%. This policy significantly reduces financial burden for vulnerable households, with the share of financially burdened households dropping from 64.5% to 18.1% when the climate dividend is implemented.",
      },
      {
        heading: "Long-Term Implications",
        content:
          "The pandemic's educational disruptions, combined with persistent employment model inequalities and uneven policy impacts, are creating long-term scars in skill development and economic mobility. Children from less-educated households face compounded disadvantages through reduced parental employment stability, lower household income, and limited access to educational resources during critical developmental periods.",
      },
    ],
    visual_data: [
      {
        source_file: "germany_parent_employment_data.csv",
        description:
          "Parental employment rates by education level and region, showing disparities in employment models.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          {
            Region: "Western Germany",
            Employment_Model: "Male breadwinner model",
            Toddler_1to2_years: 23,
            Preschool_3to5_years: 6,
            Primary_school_6to10_years: 6,
          },
          {
            Region: "Western Germany",
            Employment_Model: "One-and-a-half-earner model",
            Toddler_1to2_years: 48,
            Preschool_3to5_years: 62,
            Primary_school_6to10_years: 60,
          },
          {
            Region: "Western Germany",
            Employment_Model: "Adult worker model",
            Toddler_1to2_years: 15,
            Preschool_3to5_years: 16,
            Primary_school_6to10_years: 17,
          },
          {
            Region: "Western Germany",
            Employment_Model: "Dual earner/dual carer model",
            Toddler_1to2_years: 3,
            Preschool_3to5_years: 2,
            Primary_school_6to10_years: 2,
          },
          {
            Region: "Western Germany",
            Employment_Model: "Other",
            Toddler_1to2_years: 11,
            Preschool_3to5_years: 14,
            Primary_school_6to10_years: 15,
          },
          {
            Region: "Eastern Germany",
            Employment_Model: "Male breadwinner model",
            Toddler_1to2_years: 13,
            Preschool_3to5_years: 3,
            Primary_school_6to10_years: 3,
          },
          {
            Region: "Eastern Germany",
            Employment_Model: "One-and-a-half-earner model",
            Toddler_1to2_years: 42,
            Preschool_3to5_years: 36,
            Primary_school_6to10_years: 36,
          },
          {
            Region: "Eastern Germany",
            Employment_Model: "Adult worker model",
            Toddler_1to2_years: 22,
            Preschool_3to5_years: 39,
            Primary_school_6to10_years: 39,
          },
          {
            Region: "Eastern Germany",
            Employment_Model: "Dual earner/dual carer model",
            Toddler_1to2_years: 5,
            Preschool_3to5_years: 4,
            Primary_school_6to10_years: 4,
          },
          {
            Region: "Eastern Germany",
            Employment_Model: "Other",
            Toddler_1to2_years: 18,
            Preschool_3to5_years: 18,
            Primary_school_6to10_years: 18,
          },
        ],
      },
      {
        source_file: "germany_ideal_employment_data.csv",
        description:
          "Discrepancy between ideal and actual working hours for parents by employment model.",
        chart_type: "line",
        time_period: "present",
        data_sample: [
          {
            Region: "Western Germany",
            Employment_Model: "Male breadwinner model",
            Toddler_1to2_years: 16,
            Preschool_3to5_years: 4,
            Primary_school_6to10_years: 3,
          },
          {
            Region: "Western Germany",
            Employment_Model: "One-and-a-half-earner model",
            Toddler_1to2_years: 38,
            Preschool_3to5_years: 45,
            Primary_school_6to10_years: 40,
          },
          {
            Region: "Western Germany",
            Employment_Model: "Adult worker model",
            Toddler_1to2_years: 13,
            Preschool_3to5_years: 21,
            Primary_school_6to10_years: 34,
          },
          {
            Region: "Western Germany",
            Employment_Model: "Dual earner/dual carer model",
            Toddler_1to2_years: 26,
            Preschool_3to5_years: 23,
            Primary_school_6to10_years: 18,
          },
          {
            Region: "Western Germany",
            Employment_Model: "Other",
            Toddler_1to2_years: 7,
            Preschool_3to5_years: 7,
            Primary_school_6to10_years: 5,
          },
          {
            Region: "Eastern Germany",
            Employment_Model: "Male breadwinner model",
            Toddler_1to2_years: 4,
            Preschool_3to5_years: 2,
            Primary_school_6to10_years: 1,
          },
          {
            Region: "Eastern Germany",
            Employment_Model: "One-and-a-half-earner model",
            Toddler_1to2_years: 27,
            Preschool_3to5_years: 20,
            Primary_school_6to10_years: 19,
          },
          {
            Region: "Eastern Germany",
            Employment_Model: "Adult worker model",
            Toddler_1to2_years: 30,
            Preschool_3to5_years: 49,
            Primary_school_6to10_years: 58,
          },
          {
            Region: "Eastern Germany",
            Employment_Model: "Dual earner/dual carer model",
            Toddler_1to2_years: 35,
            Preschool_3to5_years: 26,
            Primary_school_6to10_years: 17,
          },
          {
            Region: "Eastern Germany",
            Employment_Model: "Other",
            Toddler_1to2_years: 4,
            Preschool_3to5_years: 3,
            Primary_school_6to10_years: 5,
          },
        ],
      },
      {
        source_file: "germany_household_income_data.csv",
        description:
          "Household income breakdown by employment model and education level.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          {
            Employment_Model: "Adult worker model",
            Net_Household_Income: 4861,
            Taxes: 1023,
            Social_Security_Contributions: 1492,
            Transfers: 250,
            Total_Gross_Income: 7626,
          },
          {
            Employment_Model: "Dual earner/dual carer model",
            Net_Household_Income: 3832,
            Taxes: 581,
            Social_Security_Contributions: 1119,
            Transfers: 250,
            Total_Gross_Income: 5782,
          },
          {
            Employment_Model: "One-and-a-half-earner model (part time)",
            Net_Household_Income: 3952,
            Taxes: 628,
            Social_Security_Contributions: 1131,
            Transfers: 250,
            Total_Gross_Income: 5961,
          },
          {
            Employment_Model: "One-and-a-half-earner model (mini-job)",
            Net_Household_Income: 3440,
            Taxes: 289,
            Social_Security_Contributions: 819,
            Transfers: 250,
            Total_Gross_Income: 4798,
          },
          {
            Employment_Model: "Male breadwinner model",
            Net_Household_Income: 2941,
            Taxes: 289,
            Social_Security_Contributions: 819,
            Transfers: 250,
            Total_Gross_Income: 4299,
          },
        ],
      },
      {
        source_file: "income_per_hour_data.csv",
        description: "Hourly income by education level and employment model.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          {
            Employment_Model: "Adult worker model",
            Net_Income_Per_Hour_EUR: 14.02,
          },
          {
            Employment_Model: "Dual earner/dual carer model",
            Net_Income_Per_Hour_EUR: 14.74,
          },
          {
            Employment_Model: "One-and-a-half-earner model (part time)",
            Net_Income_Per_Hour_EUR: 15.2,
          },
          {
            Employment_Model: "One-and-a-half-earner model (mini-job)",
            Net_Income_Per_Hour_EUR: 17.26,
          },
          {
            Employment_Model: "Male breadwinner model",
            Net_Income_Per_Hour_EUR: 16.96,
          },
        ],
      },
      {
        source_file: "Household_Climate_Dividend_and_Burden.csv",
        description: "Impact of climate dividend policy across income deciles.",
        chart_type: "line",
        time_period: "future",
        data_sample: [
          {
            Income_Decile: "1st_decile",
            Climate_Dividend: 0.8,
            Housing_Benefit_Increase: -0.3,
            Heating_Costs_Coverage: -0.4,
            Total_Balance: 0.2,
            Median: 0.3,
          },
          {
            Income_Decile: "2nd_decile",
            Climate_Dividend: 0.6,
            Housing_Benefit_Increase: -0.5,
            Heating_Costs_Coverage: -0.2,
            Total_Balance: -0.1,
            Median: 0.0,
          },
          {
            Income_Decile: "3rd_decile",
            Climate_Dividend: 0.5,
            Housing_Benefit_Increase: -0.2,
            Heating_Costs_Coverage: 0.0,
            Total_Balance: -0.2,
            Median: -0.1,
          },
          {
            Income_Decile: "4th_decile",
            Climate_Dividend: 0.4,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Total_Balance: -0.3,
            Median: -0.2,
          },
          {
            Income_Decile: "5th_decile",
            Climate_Dividend: 0.4,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Total_Balance: -0.4,
            Median: -0.3,
          },
          {
            Income_Decile: "6th_decile",
            Climate_Dividend: 0.3,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Total_Balance: -0.5,
            Median: -0.4,
          },
          {
            Income_Decile: "7th_decile",
            Climate_Dividend: 0.3,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Total_Balance: -0.6,
            Median: -0.5,
          },
          {
            Income_Decile: "8th_decile",
            Climate_Dividend: 0.2,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Total_Balance: -0.7,
            Median: -0.6,
          },
          {
            Income_Decile: "9th_decile",
            Climate_Dividend: 0.2,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Total_Balance: -0.8,
            Median: -0.7,
          },
          {
            Income_Decile: "10th_decile",
            Climate_Dividend: 0.1,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Total_Balance: -0.9,
            Median: -0.8,
          },
        ],
      },
      {
        source_file: "burdened_households_1_data.csv",
        description:
          "Percentage of financially burdened households under different climate policy scenarios.",
        chart_type: "bar",
        time_period: "future",
        data_sample: [
          {
            Scenario: "Without_climate_dividend",
            Teal_Percent: 16.6,
            Yellow_Percent: 21.8,
            Orange_Percent: 26.1,
            Total_Percent: 64.5,
          },
          {
            Scenario: "With_climate_dividend",
            Teal_Percent: 4.4,
            Yellow_Percent: 5.8,
            Orange_Percent: 7.9,
            Total_Percent: 18.1,
          },
          {
            Scenario: "With_reduced_climate_dividend",
            Teal_Percent: 8.3,
            Yellow_Percent: 8.7,
            Orange_Percent: 8.5,
            Total_Percent: 25.5,
          },
        ],
      },
      {
        source_file: "relieved_households_data.csv",
        description:
          "Percentage of financially relieved households under different climate policy scenarios.",
        chart_type: "bar",
        time_period: "future",
        data_sample: [
          {
            Scenario: "Without_climate_dividend",
            Teal_Percent: 1.7,
            Yellow_Percent: 2.8,
            Orange_Percent: 6.8,
            Total_Percent: 11.3,
          },
          {
            Scenario: "With_climate_dividend",
            Teal_Percent: 13.6,
            Yellow_Percent: 22.0,
            Orange_Percent: 44.7,
            Total_Percent: 80.3,
          },
          {
            Scenario: "With_reduced_climate_dividend",
            Teal_Percent: 11.5,
            Yellow_Percent: 18.9,
            Orange_Percent: 43.2,
            Total_Percent: 73.6,
          },
        ],
      },
      {
        source_file: "work_satisfaction_gender_data.csv",
        description: "Work satisfaction trends by gender over time.",
        chart_type: "line",
        time_period: "past",
        data_sample: [
          { Year: 2004, Men: 6.75, Women: 6.7 },
          { Year: 2005, Men: 6.7, Women: 6.65 },
          { Year: 2006, Men: 6.7, Women: 6.75 },
          { Year: 2007, Men: 6.8, Women: 6.85 },
          { Year: 2008, Men: 6.8, Women: 6.85 },
          { Year: 2009, Men: 6.65, Women: 6.7 },
          { Year: 2010, Men: 6.85, Women: 6.9 },
          { Year: 2011, Men: 6.95, Women: 7.0 },
          { Year: 2012, Men: 7.0, Women: 7.05 },
          { Year: 2013, Men: 7.05, Women: 7.05 },
          { Year: 2014, Men: 7.1, Women: 7.1 },
          { Year: 2015, Men: 7.1, Women: 7.1 },
          { Year: 2016, Men: 7.15, Women: 7.15 },
          { Year: 2017, Men: 7.15, Women: 7.15 },
          { Year: 2018, Men: 7.2, Women: 7.1 },
          { Year: 2019, Men: 7.2, Women: 7.15 },
          { Year: 2020, Men: 7.15, Women: 7.15 },
          { Year: 2021, Men: 7.3, Women: 7.2 },
        ],
      },
      {
        source_file: "income_satisfaction_age_data.csv",
        description: "Income satisfaction trends by age group over time.",
        chart_type: "line",
        time_period: "past",
        data_sample: [
          {
            Year: 2004,
            Under_30: 5.3,
            Under_30_Lower_Error: 5.2,
            Under_30_Upper_Error: 5.4,
            Over_30: 6.0,
          },
          {
            Year: 2005,
            Under_30: 5.1,
            Under_30_Lower_Error: 5.0,
            Under_30_Upper_Error: 5.2,
            Over_30: 6.0,
          },
          {
            Year: 2006,
            Under_30: 5.3,
            Under_30_Lower_Error: 5.2,
            Under_30_Upper_Error: 5.4,
            Over_30: 6.0,
          },
          {
            Year: 2007,
            Under_30: 5.4,
            Under_30_Lower_Error: 5.3,
            Under_30_Upper_Error: 5.5,
            Over_30: 5.9,
          },
          {
            Year: 2008,
            Under_30: 5.4,
            Under_30_Lower_Error: 5.3,
            Under_30_Upper_Error: 5.5,
            Over_30: 6.0,
          },
          {
            Year: 2009,
            Under_30: 5.5,
            Under_30_Lower_Error: 5.4,
            Under_30_Upper_Error: 5.6,
            Over_30: 6.05,
          },
          {
            Year: 2010,
            Under_30: 5.7,
            Under_30_Lower_Error: 5.6,
            Under_30_Upper_Error: 5.8,
            Over_30: 6.15,
          },
          {
            Year: 2011,
            Under_30: 5.9,
            Under_30_Lower_Error: 5.8,
            Under_30_Upper_Error: 6.0,
            Over_30: 6.3,
          },
          {
            Year: 2012,
            Under_30: 6.0,
            Under_30_Lower_Error: 5.9,
            Under_30_Upper_Error: 6.1,
            Over_30: 6.4,
          },
          {
            Year: 2013,
            Under_30: 6.0,
            Under_30_Lower_Error: 5.9,
            Under_30_Upper_Error: 6.1,
            Over_30: 6.5,
          },
          {
            Year: 2014,
            Under_30: 6.05,
            Under_30_Lower_Error: 5.95,
            Under_30_Upper_Error: 6.15,
            Over_30: 6.55,
          },
          {
            Year: 2015,
            Under_30: 6.2,
            Under_30_Lower_Error: 6.1,
            Under_30_Upper_Error: 6.3,
            Over_30: 6.65,
          },
          {
            Year: 2016,
            Under_30: 6.35,
            Under_30_Lower_Error: 6.25,
            Under_30_Upper_Error: 6.45,
            Over_30: 6.7,
          },
          {
            Year: 2017,
            Under_30: 6.3,
            Under_30_Lower_Error: 6.2,
            Under_30_Upper_Error: 6.4,
            Over_30: 6.7,
          },
          {
            Year: 2018,
            Under_30: 6.35,
            Under_30_Lower_Error: 6.25,
            Under_30_Upper_Error: 6.45,
            Over_30: 6.75,
          },
          {
            Year: 2019,
            Under_30: 6.55,
            Under_30_Lower_Error: 6.45,
            Under_30_Upper_Error: 6.65,
            Over_30: 6.95,
          },
          {
            Year: 2020,
            Under_30: 6.5,
            Under_30_Lower_Error: 6.4,
            Under_30_Upper_Error: 6.6,
            Over_30: 6.9,
          },
          {
            Year: 2021,
            Under_30: 6.85,
            Under_30_Lower_Error: 6.75,
            Under_30_Upper_Error: 6.95,
            Over_30: 7.25,
          },
        ],
      },
    ],
    document_id: "dwr-24-29,dwr-24-32,dwr-24-43",
  },
];
