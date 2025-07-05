export interface Story {
  id?: string;
  title: string;
  subtitle?: string;
  intro: string;
  author?: string;

  publishDate?: string;
  category?: string;
  actors?: string[];
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
  sections?: Array<{
    heading?: string;
    content?: string;
    title?: string;
    text?: string;
    charts?: Array<{
      title: string;
      type: string;
      data: Array<Record<string, any>>;
      source_file: string;
    }>;
    visuals?: Array<{
      id?: string;
      title: string;
      type: string;
      description?: string;
      x_axis?: string;
      y_axis?: string;
      source?: string;
    }>;
  }>;
  indicators?: Array<{
    name: string;
    unit: string;
    data: Array<Record<string, any>>;
  }>;
  references?: string[];
}

export const stories: Story[] = [
  {
    id: "germany-france-energy-puzzle",
    title:
      "The Price Divide – How Germany and France Navigate Europe's Energy Puzzle",
    subtitle: "Diverging Costs and Policy Paths in a Shared Market",
    author: "Energy Policy Team",

    actors: [
      "Low-income households",
      "Energy policymakers",
      "German government",
    ],
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
    id: "unequal-burdens-gender-gaps",
    title: "Unequal Burdens: Gender Gaps in a Reshaped Economy",
    subtitle:
      "Tracing how structural shifts and crises have intensified the economic divide for women",
    author: "Socioeconomic Analysis Team",

    publishDate: "2024-02-15",
    category: "Society",
    actors: ["Women in executive roles", "Corporate boards", "Policy makers"],
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
        source_file: "Fig35-11",
        description:
          "Gender Income Inequality in Germany (Income Inequality by Gender, Index or Ratio, Source: DIW Weekly Report)",
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
        source_file: "Fig19-05",
        description: "Efficiency and Income Split by Housing Type",
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
        source_file: "Fig35-02",
        description:
          "Real Wage Trends in the Euro Area (Real Wages Quarterly, Index 2019=100, Source: DIW Weekly Report)",
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
          {
            Period: "2019Q3",
            Euro_area: 100.5,
            Germany: 99.5,
            France: 100.2,
            Italy: 100.5,
            Spain: 100.8,
            Netherlands: 100.8,
          },
          {
            Period: "2019Q4",
            Euro_area: 100.0,
            Germany: 100.0,
            France: 100.0,
            Italy: 100.0,
            Spain: 100.0,
            Netherlands: 100.0,
          },
          {
            Period: "2020Q1",
            Euro_area: 99.5,
            Germany: 100.5,
            France: 99.0,
            Italy: 101.0,
            Spain: 101.5,
            Netherlands: 101.5,
          },
          {
            Period: "2020Q2",
            Euro_area: 89.5,
            Germany: 95.0,
            France: 92.0,
            Italy: 90.0,
            Spain: 89.5,
            Netherlands: 95.0,
          },
          {
            Period: "2020Q3",
            Euro_area: 101.0,
            Germany: 100.5,
            France: 102.0,
            Italy: 102.5,
            Spain: 103.0,
            Netherlands: 105.0,
          },
          {
            Period: "2020Q4",
            Euro_area: 101.5,
            Germany: 101.0,
            France: 102.5,
            Italy: 103.0,
            Spain: 103.5,
            Netherlands: 104.5,
          },
          {
            Period: "2021Q1",
            Euro_area: 101.0,
            Germany: 100.0,
            France: 102.0,
            Italy: 102.0,
            Spain: 102.5,
            Netherlands: 103.5,
          },
          {
            Period: "2021Q2",
            Euro_area: 100.5,
            Germany: 99.5,
            France: 101.5,
            Italy: 101.5,
            Spain: 102.0,
            Netherlands: 103.0,
          },
          {
            Period: "2021Q3",
            Euro_area: 100.0,
            Germany: 99.0,
            France: 101.0,
            Italy: 101.0,
            Spain: 101.5,
            Netherlands: 102.5,
          },
          {
            Period: "2021Q4",
            Euro_area: 99.5,
            Germany: 98.5,
            France: 100.5,
            Italy: 100.5,
            Spain: 101.0,
            Netherlands: 102.0,
          },
          {
            Period: "2022Q1",
            Euro_area: 98.5,
            Germany: 97.5,
            France: 99.5,
            Italy: 99.5,
            Spain: 100.0,
            Netherlands: 100.5,
          },
          {
            Period: "2022Q2",
            Euro_area: 97.5,
            Germany: 96.5,
            France: 98.5,
            Italy: 98.5,
            Spain: 99.0,
            Netherlands: 96.0,
          },
          {
            Period: "2022Q3",
            Euro_area: 96.5,
            Germany: 95.5,
            France: 97.5,
            Italy: 97.5,
            Spain: 98.0,
            Netherlands: 93.0,
          },
          {
            Period: "2022Q4",
            Euro_area: 96.0,
            Germany: 95.0,
            France: 97.0,
            Italy: 97.0,
            Spain: 97.5,
            Netherlands: 92.5,
          },
          {
            Period: "2023Q1",
            Euro_area: 96.5,
            Germany: 95.5,
            France: 97.5,
            Italy: 93.5,
            Spain: 97.0,
            Netherlands: 93.5,
          },
          {
            Period: "2023Q2",
            Euro_area: 97.0,
            Germany: 96.0,
            France: 98.0,
            Italy: 93.0,
            Spain: 97.5,
            Netherlands: 94.5,
          },
          {
            Period: "2023Q3",
            Euro_area: 97.5,
            Germany: 96.5,
            France: 98.5,
            Italy: 93.5,
            Spain: 98.0,
            Netherlands: 95.5,
          },
          {
            Period: "2023Q4",
            Euro_area: 98.0,
            Germany: 97.0,
            France: 99.0,
            Italy: 94.0,
            Spain: 98.5,
            Netherlands: 96.5,
          },
          {
            Period: "2024Q1",
            Euro_area: 98.5,
            Germany: 97.5,
            France: 99.5,
            Italy: 94.5,
            Spain: 99.0,
            Netherlands: 97.5,
          },
          {
            Period: "2024Q2",
            Euro_area: 99.0,
            Germany: 98.0,
            France: 100.0,
            Italy: 95.0,
            Spain: 99.5,
            Netherlands: 98.5,
          },
          {
            Period: "2024Q3",
            Euro_area: 99.5,
            Germany: 98.5,
            France: 100.5,
            Italy: 95.5,
            Spain: 100.0,
            Netherlands: 99.5,
          },
          {
            Period: "2024Q4",
            Euro_area: 100.0,
            Germany: 99.0,
            France: 101.0,
            Italy: 96.0,
            Spain: 100.5,
            Netherlands: 100.5,
          },
        ],
      },
    ],
  },
  {
    title:
      "Educational Inequity Post-Pandemic: Long-Term Scars in Skill Development",
    category: "Education",
    subtitle: "How COVID-19 Set Back Learning Outcomes for a Generation",
    author: "Education and Social Policy Team",
    actors: ["EU households", "Energy policymakers", "Low-income families"],
    intro:
      "The aftermath of the COVID-19 pandemic has left a visible scar on Germany’s workforce, particularly in terms of educational inequality and future skill development. Parents, especially women, continue to work fewer hours than they desire due to childcare responsibilities, while income disparities persist post-parenthood. Environmental policies like the climate dividend also disproportionately affect low-income and educationally disadvantaged households, raising concerns about social equity in the green transition.",
    indicators: [
      {
        name: "Ideal vs Actual Weekly Working Hours by Parenthood and Gender",
        unit: "Hours",
        data: [
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
        name: "Household Income Difference Between Parents and Non-Parents",
        unit: "Euros",
        data: [
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
        name: "Household Burden and Relief from Climate Dividend Policy",
        unit: "Percent",
        data: [
          {
            Income_Decile: "1st_decile",
            Climate_Dividend: 0.8,
            Housing_Benefit_Increase: -0.3,
            Heating_Costs_Coverage: -0.4,
            Super_E10: -0.6,
            Diesel: -0.3,
            Heating_Oil: -0.2,
            Liquefied_Gas: -0.4,
            Natural_Gas: -0.8,
            Total_Balance: 0.2,
            Median: 0.3,
          },
          {
            Income_Decile: "2nd_decile",
            Climate_Dividend: 0.6,
            Housing_Benefit_Increase: -0.5,
            Heating_Costs_Coverage: -0.2,
            Super_E10: -0.5,
            Diesel: -0.4,
            Heating_Oil: -0.3,
            Liquefied_Gas: -0.3,
            Natural_Gas: -0.6,
            Total_Balance: -0.1,
            Median: 0.0,
          },
          {
            Income_Decile: "3rd_decile",
            Climate_Dividend: 0.5,
            Housing_Benefit_Increase: -0.2,
            Heating_Costs_Coverage: 0.0,
            Super_E10: -0.4,
            Diesel: -0.5,
            Heating_Oil: -0.4,
            Liquefied_Gas: -0.2,
            Natural_Gas: -0.5,
            Total_Balance: -0.2,
            Median: -0.1,
          },
          {
            Income_Decile: "4th_decile",
            Climate_Dividend: 0.4,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Super_E10: -0.3,
            Diesel: -0.6,
            Heating_Oil: -0.5,
            Liquefied_Gas: -0.2,
            Natural_Gas: -0.4,
            Total_Balance: -0.3,
            Median: -0.2,
          },
          {
            Income_Decile: "5th_decile",
            Climate_Dividend: 0.4,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Super_E10: -0.3,
            Diesel: -0.7,
            Heating_Oil: -0.6,
            Liquefied_Gas: -0.2,
            Natural_Gas: -0.4,
            Total_Balance: -0.4,
            Median: -0.3,
          },
          {
            Income_Decile: "6th_decile",
            Climate_Dividend: 0.3,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Super_E10: -0.3,
            Diesel: -0.8,
            Heating_Oil: -0.7,
            Liquefied_Gas: -0.2,
            Natural_Gas: -0.5,
            Total_Balance: -0.5,
            Median: -0.4,
          },
          {
            Income_Decile: "7th_decile",
            Climate_Dividend: 0.3,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Super_E10: -0.3,
            Diesel: -0.9,
            Heating_Oil: -0.8,
            Liquefied_Gas: -0.2,
            Natural_Gas: -0.5,
            Total_Balance: -0.6,
            Median: -0.5,
          },
          {
            Income_Decile: "8th_decile",
            Climate_Dividend: 0.2,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Super_E10: -0.2,
            Diesel: -1.0,
            Heating_Oil: -0.9,
            Liquefied_Gas: -0.2,
            Natural_Gas: -0.5,
            Total_Balance: -0.7,
            Median: -0.6,
          },
          {
            Income_Decile: "9th_decile",
            Climate_Dividend: 0.2,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Super_E10: -0.2,
            Diesel: -1.1,
            Heating_Oil: -1.0,
            Liquefied_Gas: -0.2,
            Natural_Gas: -0.5,
            Total_Balance: -0.8,
            Median: -0.7,
          },
          {
            Income_Decile: "10th_decile",
            Climate_Dividend: 0.1,
            Housing_Benefit_Increase: 0.0,
            Heating_Costs_Coverage: 0.0,
            Super_E10: -0.2,
            Diesel: -1.2,
            Heating_Oil: -1.1,
            Liquefied_Gas: -0.2,
            Natural_Gas: -0.5,
            Total_Balance: -0.9,
            Median: -0.8,
          },
          {
            Income_Decile: "Total",
            Climate_Dividend: 0.3,
            Housing_Benefit_Increase: -0.1,
            Heating_Costs_Coverage: -0.1,
            Super_E10: -0.3,
            Diesel: -0.8,
            Heating_Oil: -0.7,
            Liquefied_Gas: -0.2,
            Natural_Gas: -0.5,
            Total_Balance: -0.5,
            Median: -0.4,
          },
        ],
      },
      {
        name: "Share of Households Relieved by Climate Dividend",
        unit: "Percent",
        data: [
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
        name: "Share of Households Burdened by Climate Costs",
        unit: "Percent",
        data: [
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
    ],
    references: [
      "dwr-24-29",
      "dwr-24-32",
      "dwr-24-43",
      "Fig-2_germany_ideal_employment_data.csv",
      "Fig-3_germany_household_income_data.csv",
      "fig-1_Household_Climate_Dividend_and_Burden.csv",
      "fig-2_relieved_households_data.csv",
      "fig-2_burdened_households_1_data.csv",
    ],
  },
  {
    id: "carbon-costs-compensation-germany",
    title:
      "Carbon Costs and Compensation: The Past, Present, and Future of Germany’s Climate Burden",
    category: "Climate Policy",
    subtitle: "Balancing Decarbonization With Social Fairness in Germany",
    author: "Climate Policy and Social Equity Team",
    actors: ["Women in Europe", "Policy makers", "Employers"],
    intro:
      "This story explores how carbon pricing has financially impacted German households over time, detailing past burdens, present reliefs, and projected future concerns if climate dividends are reduced.",
    sections: [
      {
        heading: "Past: Burdened by Carbon Pricing",
        content:
          "Initially, a significant proportion of German households experienced financial stress due to carbon pricing, particularly those with lower incomes and higher energy needs.",
        charts: [
          {
            title:
              "Share of Households Burdened by Carbon Pricing (>1% Income Loss)",
            type: "bar",
            data: [
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
            source_file: "fig-2_burdened_households_1_data.csv",
          },
        ],
      },
      {
        title: "Present: Relief via Climate Dividend",
        text: "To offset this impact, climate dividend transfers have helped relieve a considerable number of households, effectively turning the policy from regressive to neutral or even progressive.",
        charts: [
          {
            title: "Households Gaining from Climate Dividend Transfers",
            type: "bar",
            data: [
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
            source_file: "fig-2_relieved_households_data.csv",
          },
        ],
      },
      {
        title: "Future: Risk of Reduced Support",
        text: "Looking ahead, simulations show that a reduced climate dividend would shift the balance again, increasing the burden on already vulnerable groups and risking renewed inequality.",
        charts: [
          {
            title: "Projected Household Impact After Reducing Climate Dividend",
            type: "bar",
            data: [
              {
                Income_Decile: "1st_decile",
                Climate_Dividend: 0.4,
                Housing_Benefit_Increase: -0.3,
                Heating_Costs_Coverage: -0.4,
                Super_E10: -0.6,
                Diesel: -0.3,
                Heating_Oil: -0.2,
                Liquefied_Gas: -0.4,
                Natural_Gas: -0.8,
                Total_Balance: -0.2,
                Median: -0.1,
              },
              {
                Income_Decile: "2nd_decile",
                Climate_Dividend: 0.3,
                Housing_Benefit_Increase: -0.5,
                Heating_Costs_Coverage: -0.2,
                Super_E10: -0.5,
                Diesel: -0.4,
                Heating_Oil: -0.3,
                Liquefied_Gas: -0.3,
                Natural_Gas: -0.6,
                Total_Balance: -0.5,
                Median: -0.4,
              },
              {
                Income_Decile: "3rd_decile",
                Climate_Dividend: 0.25,
                Housing_Benefit_Increase: -0.2,
                Heating_Costs_Coverage: 0.0,
                Super_E10: -0.4,
                Diesel: -0.5,
                Heating_Oil: -0.4,
                Liquefied_Gas: -0.2,
                Natural_Gas: -0.5,
                Total_Balance: -0.6,
                Median: -0.5,
              },
              {
                Income_Decile: "4th_decile",
                Climate_Dividend: 0.2,
                Housing_Benefit_Increase: 0.0,
                Heating_Costs_Coverage: 0.0,
                Super_E10: -0.3,
                Diesel: -0.6,
                Heating_Oil: -0.5,
                Liquefied_Gas: -0.2,
                Natural_Gas: -0.4,
                Total_Balance: -0.7,
                Median: -0.6,
              },
              {
                Income_Decile: "5th_decile",
                Climate_Dividend: 0.2,
                Housing_Benefit_Increase: 0.0,
                Heating_Costs_Coverage: 0.0,
                Super_E10: -0.3,
                Diesel: -0.7,
                Heating_Oil: -0.6,
                Liquefied_Gas: -0.2,
                Natural_Gas: -0.4,
                Total_Balance: -0.8,
                Median: -0.7,
              },
              {
                Income_Decile: "6th_decile",
                Climate_Dividend: 0.15,
                Housing_Benefit_Increase: 0.0,
                Heating_Costs_Coverage: 0.0,
                Super_E10: -0.3,
                Diesel: -0.8,
                Heating_Oil: -0.7,
                Liquefied_Gas: -0.2,
                Natural_Gas: -0.5,
                Total_Balance: -0.9,
                Median: -0.8,
              },
              {
                Income_Decile: "7th_decile",
                Climate_Dividend: 0.15,
                Housing_Benefit_Increase: 0.0,
                Heating_Costs_Coverage: 0.0,
                Super_E10: -0.3,
                Diesel: -0.9,
                Heating_Oil: -0.8,
                Liquefied_Gas: -0.2,
                Natural_Gas: -0.5,
                Total_Balance: -1.0,
                Median: -0.9,
              },
              {
                Income_Decile: "8th_decile",
                Climate_Dividend: 0.1,
                Housing_Benefit_Increase: 0.0,
                Heating_Costs_Coverage: 0.0,
                Super_E10: -0.2,
                Diesel: -1.0,
                Heating_Oil: -0.9,
                Liquefied_Gas: -0.2,
                Natural_Gas: -0.5,
                Total_Balance: -1.1,
                Median: -1.0,
              },
              {
                Income_Decile: "9th_decile",
                Climate_Dividend: 0.1,
                Housing_Benefit_Increase: 0.0,
                Heating_Costs_Coverage: 0.0,
                Super_E10: -0.2,
                Diesel: -1.1,
                Heating_Oil: -1.0,
                Liquefied_Gas: -0.2,
                Natural_Gas: -0.5,
                Total_Balance: -1.2,
                Median: -1.1,
              },
              {
                Income_Decile: "10th_decile",
                Climate_Dividend: 0.05,
                Housing_Benefit_Increase: 0.0,
                Heating_Costs_Coverage: 0.0,
                Super_E10: -0.2,
                Diesel: -1.2,
                Heating_Oil: -1.1,
                Liquefied_Gas: -0.2,
                Natural_Gas: -0.5,
                Total_Balance: -1.3,
                Median: -1.2,
              },
              {
                Income_Decile: "Total",
                Climate_Dividend: 0.15,
                Housing_Benefit_Increase: -0.1,
                Heating_Costs_Coverage: -0.1,
                Super_E10: -0.3,
                Diesel: -0.8,
                Heating_Oil: -0.7,
                Liquefied_Gas: -0.2,
                Natural_Gas: -0.5,
                Total_Balance: -0.9,
                Median: -0.8,
              },
            ],
            source_file:
              "fig-3_reduced_climate_dividend_household_impact_data.csv",
          },
        ],
      },
    ],
    references: [
      "dwr-24-43",
      "fig-2_burdened_households_1_data.csv",
      "fig-2_relieved_households_data.csv",
      "fig-3_reduced_climate_dividend_household_impact_data.csv",
    ],
  },
  {
    title:
      "The Squeeze on the Middle — Income, Satisfaction, and Climate Burden in Germany",
    category: "Social Policy",
    subtitle:
      "Why Germany’s Middle Class Feels Left Behind in the Green Transition",
    author: "Social Distribution & Energy Policy Group",
    actors: [
      "Middle-class families",
      "German policymakers",
      "Welfare economists",
    ],
    document_id: "dwr-24-32",
    intro:
      "Germany's middle-income households are increasingly caught in a squeeze. Not poor enough to benefit most from state relief and not wealthy enough to absorb economic shocks, they face increasing burdens from energy transitions, inflation, and stagnant wages. This story uncovers how climate policies, household burdens, and income-related satisfaction are converging to disproportionately affect middle-income groups.",
    sections: [
      {
        heading: "I. The Past: Energy Pricing and a Disproportionate Burden",
        content:
          "As Germany intensified its carbon pricing strategy, a portion of households began to bear a disproportionate financial burden. Middle-income groups — especially those just above welfare thresholds — saw the sharpest increase in energy costs relative to their income.",
        visuals: [
          {
            id: "Fig32-01",
            title:
              "Share of Household Income Burdened by Carbon Pricing (2022)",
            type: "bar",
            description:
              "Shows how carbon pricing disproportionately affected the middle-income deciles.",
            x_axis: "Income Decile",
            y_axis: "Share of Income Burdened (%)",
            source: "fig-2_burdened_households_1_data.csv",
          },
          {
            id: "Fig32-02",
            title: "Household Relief via Climate Dividend by Decile",
            type: "bar",
            description:
              "Net income gains or losses by income group from the climate dividend policy.",
            x_axis: "Income Decile",
            y_axis: "Net Effect (€)",
            source: "fig-2_relieved_households_data.csv",
          },
        ],
      },
      {
        heading:
          "II. The Present: Stagnant Satisfaction and Socioeconomic Strain",
        content:
          "Despite Germany’s economic recovery, income satisfaction remains significantly lower in middle-income brackets. These households also report declining satisfaction in work and health, suggesting broader quality-of-life concerns.",
        visuals: [
          {
            id: "Fig43-01",
            title: "Income Satisfaction by Income Level",
            type: "bar",
            description:
              "Self-reported satisfaction by income group, revealing persistent inequality in well-being.",
            x_axis: "Income Group",
            y_axis: "Satisfaction Score (0-10)",
            source: "fig-2_4_income_satisfaction_income_level_data.csv",
          },
          {
            id: "Fig43-02",
            title: "Work and Health Satisfaction by Income Group",
            type: "grouped_bar",
            description:
              "Comparison of work and health satisfaction scores across income groups.",
            x_axis: "Income Group",
            y_axis: "Satisfaction Score (0-10)",
            source: "fig-3_4_work_satisfaction_income_data.csv",
          },
        ],
      },
      {
        heading: "III. The Future: Political Risks of Middle-Class Discontent",
        content:
          "If current climate burdens and inflation pressures persist without targeted support for the middle class, satisfaction and political trust may decline. These groups represent a large voting bloc, and their discontent could destabilize support for green reforms.",
        visuals: [
          {
            id: "Fig43-03",
            title:
              "Projected Income Satisfaction Under Increased Carbon Price (2030)",
            type: "line",
            description:
              "Projected satisfaction scores across income groups if carbon prices increase by 2030.",
            x_axis: "Income Group",
            y_axis: "Projected Satisfaction Score (0-10)",
            source: "fig-5_2_income_satisfaction_projection_2030_data.csv",
          },
          {
            id: "Fig43-04",
            title:
              "Expected Net Burden from Carbon Pricing by 2030 (with Dividend Reform)",
            type: "bar",
            description:
              "Forecasted net financial burden from carbon pricing by income decile in 2030.",
            x_axis: "Income Decile",
            y_axis: "Net Burden (€)",
            source: "fig-5_3_carbon_net_burden_projection_2030_data.csv",
          },
        ],
      },
    ],
    visual_data: [
      {
        source_file: "fig-2_burdened_households_1_data.csv",
        description:
          "Shows how carbon pricing disproportionately affected the middle-income deciles.",
        chart_type: "bar",
        time_period: "past",
        data_sample: [
          { "Income Decile": "1st", "Burden (%)": 4.5 },
          { "Income Decile": "2nd", "Burden (%)": 4.2 },
          { "Income Decile": "3rd", "Burden (%)": 4.0 },
          { "Income Decile": "4th", "Burden (%)": 4.8 },
          { "Income Decile": "5th", "Burden (%)": 5.3 },
          { "Income Decile": "6th", "Burden (%)": 5.1 },
          { "Income Decile": "7th", "Burden (%)": 4.7 },
          { "Income Decile": "8th", "Burden (%)": 3.9 },
          { "Income Decile": "9th", "Burden (%)": 3.2 },
          { "Income Decile": "10th", "Burden (%)": 2.6 },
        ],
      },
      {
        source_file: "fig-2_relieved_households_data.csv",
        description:
          "Net income gains or losses by income group from the climate dividend policy.",
        chart_type: "bar",
        time_period: "past",
        data_sample: [
          { "Income Decile": "1st", "Net Effect (€)": 240 },
          { "Income Decile": "2nd", "Net Effect (€)": 190 },
          { "Income Decile": "3rd", "Net Effect (€)": 140 },
          { "Income Decile": "4th", "Net Effect (€)": 60 },
          { "Income Decile": "5th", "Net Effect (€)": -10 },
          { "Income Decile": "6th", "Net Effect (€)": -50 },
          { "Income Decile": "7th", "Net Effect (€)": -90 },
          { "Income Decile": "8th", "Net Effect (€)": -120 },
          { "Income Decile": "9th", "Net Effect (€)": -170 },
          { "Income Decile": "10th", "Net Effect (€)": -220 },
        ],
      },
      {
        source_file: "fig-2_4_income_satisfaction_income_level_data.csv",
        description:
          "Self-reported satisfaction by income group, revealing persistent inequality in well-being.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { "Income Group": "Low", "Satisfaction Score (0-10)": 5.4 },
          { "Income Group": "Middle", "Satisfaction Score (0-10)": 4.8 },
          { "Income Group": "High", "Satisfaction Score (0-10)": 6.2 },
        ],
      },
      {
        source_file: "fig-3_4_work_satisfaction_income_data.csv",
        description:
          "Comparison of work and health satisfaction scores across income groups.",
        chart_type: "grouped_bar",
        time_period: "present",
        data_sample: [
          { "Income Group": "Low", Work: 5.2, Health: 5.5 },
          { "Income Group": "Middle", Work: 4.6, Health: 4.9 },
          { "Income Group": "High", Work: 6.0, Health: 6.3 },
        ],
      },
      {
        source_file: "fig-5_2_income_satisfaction_projection_2030_data.csv",
        description:
          "Projected satisfaction scores across income groups if carbon prices increase by 2030.",
        chart_type: "line",
        time_period: "future",
        data_sample: [
          { "Income Group": "Low", Score: 5.2 },
          { "Income Group": "Middle", Score: 4.1 },
          { "Income Group": "High", Score: 6.4 },
        ],
      },
      {
        source_file: "fig-5_3_carbon_net_burden_projection_2030_data.csv",
        description:
          "Forecasted net financial burden from carbon pricing by income decile in 2030.",
        chart_type: "bar",
        time_period: "future",
        data_sample: [
          { "Income Decile": "1st", "Net Burden (€)": -180 },
          { "Income Decile": "2nd", "Net Burden (€)": -90 },
          { "Income Decile": "3rd", "Net Burden (€)": -10 },
          { "Income Decile": "4th", "Net Burden (€)": 40 },
          { "Income Decile": "5th", "Net Burden (€)": 70 },
          { "Income Decile": "6th", "Net Burden (€)": 110 },
          { "Income Decile": "7th", "Net Burden (€)": 140 },
          { "Income Decile": "8th", "Net Burden (€)": 160 },
          { "Income Decile": "9th", "Net Burden (€)": 190 },
          { "Income Decile": "10th", "Net Burden (€)": 240 },
        ],
      },
    ],
    references: [
      "fig-2_burdened_households_1_data.csv",
      "fig-2_relieved_households_data.csv",
      "fig-2_4_income_satisfaction_income_level_data.csv",
      "fig-3_4_work_satisfaction_income_data.csv",
      "fig-5_2_income_satisfaction_projection_2030_data.csv",
      "fig-5_3_carbon_net_burden_projection_2030_data.csv",
      "dwr-24-32.pdf",
      "dwr-24-43.pdf",
    ],
  },
  {
    title:
      "From Bricks to Bytes — How Construction and Digitalization Reshape Labor Demand",
    category: "Labor Market",
    subtitle:
      "Tracking Germany’s Labor Shifts Across Sectors in a Transforming Economy",
    author: "Labor Market Transformation Unit",
    actors: [
      "Construction workers",
      "Tech employees",
      "Youth workforce",
      "German employers",
    ],
    document_id: "dwr-24-01",
    intro:
      "This story explores the shifting landscape of labor demand in Germany as the economy transitions from traditional construction sectors to digital industries. By analyzing data from technology investment trends, construction activity forecasts, and labor market preferences, it highlights how workers are navigating the dual transformation of the physical and digital economies.",
    sections: [
      {
        heading: "I. The Past: Construction Sector Revival",
        content:
          "After stagnation during the pandemic, Germany's construction sector began to rebound. Investment in building and infrastructure projects rose steadily, offering labor opportunities particularly in skilled trades and energy-efficient retrofitting.",
        visuals: [
          {
            id: "Fig01-01",
            title: "Construction Investment Growth",
            type: "bar",
            description:
              "Annual growth in construction sector investments in Germany since 2019.",
            x_axis: "Year",
            y_axis: "Investment Index (2015=100)",
            source: "Fig_4_6_germany_construction_investment_data.csv",
          },
        ],
      },
      {
        heading: "II. The Present: Digital Investment Surge",
        content:
          "Germany has seen a surge in digital transformation initiatives across industries. With rising investments in software, AI, and digital infrastructure, the demand for digitally skilled labor continues to grow, reshaping the employment landscape.",
        visuals: [
          {
            id: "Fig01-02",
            title: "Technology Investments in Germany",
            type: "line",
            description:
              "Tracks annual digital/tech investment in Germany between 2019 and 2023.",
            x_axis: "Year",
            y_axis: "Investment (Billion Euros)",
            source: "dwr-24-01_fig_technology_investments.csv",
          },
        ],
      },
      {
        heading: "III. The Future: Navigating Labor Preferences",
        content:
          "Younger generations show a clear shift in employment preferences. While construction offers secure jobs, many increasingly aspire to work in digital or flexible sectors. This divergence may widen sectoral labor gaps in the near future.",
        visuals: [
          {
            id: "Fig01-03",
            title: "Youth Employment Preferences by Sector",
            type: "pie",
            description:
              "Preferred job sectors among youth, illustrating digitalization's appeal.",
            x_axis: "",
            y_axis: "",
            source: "Fig-2_germany_ideal_employment_data.csv",
          },
        ],
      },
    ],
    visual_data: [
      {
        source_file: "Fig_4_6_germany_construction_investment_data.csv",
        description:
          "Annual growth in construction sector investments in Germany since 2019.",
        chart_type: "bar",
        time_period: "past",
        data_sample: [
          { Year: "2019", Index: 105.2 },
          { Year: "2020", Index: 102.4 },
          { Year: "2021", Index: 108.3 },
          { Year: "2022", Index: 114.7 },
          { Year: "2023", Index: 119.9 },
        ],
      },
      {
        source_file: "dwr-24-01_fig_technology_investments.csv",
        description:
          "Tracks annual digital/tech investment in Germany between 2019 and 2023.",
        chart_type: "line",
        time_period: "present",
        data_sample: [
          { Year: "2019", Investment: 18.2 },
          { Year: "2020", Investment: 19.5 },
          { Year: "2021", Investment: 21.3 },
          { Year: "2022", Investment: 23.9 },
          { Year: "2023", Investment: 26.7 },
        ],
      },
      {
        source_file: "Fig-2_germany_ideal_employment_data.csv",
        description:
          "Preferred job sectors among youth, illustrating digitalization's appeal.",
        chart_type: "pie",
        time_period: "future",
        data_sample: [
          { Sector: "Digital/Tech", Percentage: 42 },
          { Sector: "Construction", Percentage: 18 },
          { Sector: "Services", Percentage: 25 },
          { Sector: "Manufacturing", Percentage: 15 },
        ],
      },
    ],
    references: [
      "Fig_4_6_germany_construction_investment_data.csv",
      "dwr-24-01_fig_technology_investments.csv",
      "Fig-2_germany_ideal_employment_data.csv",
      "dwr-24-01",
      "dwr-24-29",
      "dwr-24-35",
    ],
  },
  {
    id: "germany-satisfaction-gap",
    category: "Social Inequality",
    title:
      "Bridging the Satisfaction Gap — How Age, Income, and Gender Define Modern Discontent",
    subtitle:
      "What Germany’s Satisfaction Trends Reveal About Deep Social Divides",
    author: "Social Inequality and Wellbeing Group",
    actors: ["Middle-income households", "Policy makers", "Energy economists"],
    document_id: "dwr-24-32",
    intro:
      "This story investigates how different dimensions of satisfaction—across gender, age, and income level—reflect systemic disparities in Germany. By comparing survey data over time, we uncover how satisfaction levels vary and what factors correlate with long-term discontent.",
    sections: [
      {
        heading: "I. The Gender Divide in Satisfaction",
        content:
          "Men consistently report higher satisfaction with their income than women over the years, suggesting persistent gender-based income perception disparities.",
        visuals: [
          {
            id: "Fig32-01",
            title: "Income Satisfaction by Gender (2004–2023)",
            type: "line",
            description:
              "Satisfaction scores by gender over two decades, showing a persistent male-female gap.",
            x_axis: "Year",
            y_axis: "Satisfaction Score (0–10)",
            source: "fig-2_1_income_satisfaction_gender_data.csv",
          },
        ],
      },
      {
        heading: "II. Intergenerational Discontent",
        content:
          "Younger respondents (<30) report lower satisfaction with income compared to those over 30. This gap has remained stable and highlights intergenerational economic pressure.",
        visuals: [
          {
            id: "Fig32-02",
            title: "Income Satisfaction by Age Group (2004–2023)",
            type: "line",
            description:
              "Tracks satisfaction levels of younger and older groups, showing generational trends.",
            x_axis: "Year",
            y_axis: "Satisfaction Score (0–10)",
            source: "fig-2_3_income_satisfaction_age_data.csv",
          },
        ],
      },
      {
        heading: "III. The Income Satisfaction Gradient",
        content:
          "A clear correlation exists between income level and satisfaction: low-income individuals consistently report much lower satisfaction scores than their middle- or high-income counterparts.",
        visuals: [
          {
            id: "Fig32-03",
            title: "Income Satisfaction by Income Level (2004–2023)",
            type: "line",
            description:
              "Three-tier satisfaction scores based on income groups across time.",
            x_axis: "Year",
            y_axis: "Satisfaction Score (0–10)",
            source: "fig-2_4_income_satisfaction_income_level_data.csv",
          },
        ],
      },
    ],
    visual_data: [
      {
        source_file: "fig-2_1_income_satisfaction_gender_data.csv",
        description:
          "Satisfaction scores by gender over two decades, showing a persistent male-female gap.",
        chart_type: "line",
        time_period: "past",
        data_sample: [
          { Year: 2004, Men: 5.7, Women: 5.3 },
          { Year: 2011, Men: 6.2, Women: 5.7 },
          { Year: 2021, Men: 7.0, Women: 6.7 },
        ],
      },
      {
        source_file: "fig-2_3_income_satisfaction_age_data.csv",
        description:
          "Tracks satisfaction levels of younger and older groups, showing generational trends.",
        chart_type: "line",
        time_period: "past",
        data_sample: [
          { Year: 2004, Under_30: 5.3, Over_30: 6.0 },
          { Year: 2011, Under_30: 5.9, Over_30: 6.3 },
          { Year: 2021, Under_30: 6.85, Over_30: 7.25 },
        ],
      },
      {
        source_file: "fig-2_4_income_satisfaction_income_level_data.csv",
        description:
          "Three-tier satisfaction scores based on income groups across time.",
        chart_type: "line",
        time_period: "past",
        data_sample: [
          {
            Year: 2004,
            Low_Income: 4.3,
            Middle_Income: 5.6,
            High_Income: 6.65,
          },
          { Year: 2011, Low_Income: 4.7, Middle_Income: 6.1, High_Income: 7.0 },
          {
            Year: 2021,
            Low_Income: 5.85,
            Middle_Income: 7.0,
            High_Income: 7.8,
          },
        ],
      },
    ],
    references: [
      "fig-2_1_income_satisfaction_gender_data.csv",
      "fig-2_3_income_satisfaction_age_data.csv",
      "fig-2_4_income_satisfaction_income_level_data.csv",
      "dwr-24-32",
    ],
  },
  {
    title:
      "The Sanctions Ripple — Mapping Welfare Losses from Russian Trade Isolation",
    category: "Trade Policy",
    subtitle:
      "How Sanctions Against Russia Backfired Economically Across Borders",
    author: "Trade Policy and Geo-Economic Impact Group",
    actors: ["Russia", "Sanctioning countries", "Neighboring economies"],
    document_id: "dwr-24-08",
    intro:
      "This story explores the economic welfare losses triggered by Russian trade sanctions, highlighting the cascading effects on neighboring nations and key sanctioning countries. By visualizing the direct and indirect impact through welfare loss percentages, it reveals the broader economic vulnerability to geopolitical disruptions.",
    sections: [
      {
        heading: "I. Regional Spillovers Near Russia",
        content:
          "Russia’s neighboring countries experienced notable welfare losses due to both multilateral and unilateral sanctions. Baltic states such as Lithuania and Estonia were disproportionately affected due to trade dependencies.",
        visuals: [
          {
            id: "Fig08-01",
            title: "Welfare Losses in Russia's Neighboring Countries",
            type: "bar",
            description:
              "Compares the percentage of welfare loss due to multilateral and unilateral sanctions imposed on Russia in neighboring countries.",
            x_axis: "Country",
            y_axis: "Welfare Loss (%)",
            source: "fig-1_russia_sanctions_welfare_loss_data.csv",
          },
        ],
      },
      {
        heading: "II. Economic Blowback on Sanctioning Nations",
        content:
          "Even countries imposing sanctions—such as Germany, the U.S., and Italy—suffered non-trivial economic losses. Multilateral action caused higher losses than unilateral efforts, revealing the high price of collective punishment.",
        visuals: [
          {
            id: "Fig08-02",
            title: "Welfare Losses in Sanctioning Countries",
            type: "bar",
            description:
              "Shows how sanctions economically impacted the sanctioning countries themselves, especially in Western Europe and the U.S.",
            x_axis: "Country",
            y_axis: "Welfare Loss (%)",
            source: "fig-2_russia_welfare_loss_by_sanctioning_country_data.csv",
          },
        ],
      },
      {
        heading: "III. Russia’s Future Under Escalated Scenarios",
        content:
          "If sanctions intensified into a full trade embargo, Russia could face welfare losses over 15%, depending on coalition scope. The 2014 sanctions already caused a significant decline in economic welfare.",
        visuals: [
          {
            id: "Tab08-01",
            title:
              "Projected Welfare Losses for Russia under Different Sanction Scenarios",
            type: "bar",
            description:
              "Outlines Russia’s welfare losses under actual 2014 sanctions and two hypothetical escalated scenarios.",
            x_axis: "Scenario",
            y_axis: "Welfare Loss (%)",
            source: "table-01_welfare_losses_russia_scenarios_data.csv",
          },
        ],
      },
    ],
    visual_data: [
      {
        source_file: "fig-1_russia_sanctions_welfare_loss_data.csv",
        description:
          "Compares welfare losses (%) for neighboring countries under multilateral vs. unilateral sanctions.",
        chart_type: "bar",
        time_period: "past",
        data_sample: [
          { Country: "Lithuania", Multilateral: -0.65, Unilateral: -0.5 },
          { Country: "Estonia", Multilateral: -0.35, Unilateral: -0.4 },
          { Country: "Ukraine", Multilateral: -0.35, Unilateral: -0.45 },
        ],
      },
      {
        source_file:
          "fig-2_russia_welfare_loss_by_sanctioning_country_data.csv",
        description:
          "Economic costs borne by countries that imposed sanctions on Russia.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { Country: "Germany", Multilateral: -0.32, Unilateral: -0.28 },
          { Country: "USA", Multilateral: -0.31, Unilateral: -0.26 },
        ],
      },
      {
        source_file: "table-01_welfare_losses_russia_scenarios_data.csv",
        description:
          "Welfare loss projections under different global sanction coalition scenarios, including hypothetical full embargo.",
        chart_type: "bar",
        time_period: "future",
        data_sample: [
          {
            Scenario: "2014 sanctions",
            "2014 Coalition": -1.44,
            "Global Coalition": -2.49,
          },
          {
            Scenario: "Hypothetical embargo",
            "2014 Coalition": -8.81,
            "Global Coalition": -15.24,
          },
        ],
      },
    ],
    references: [
      "dwr-24-08",
      "fig-1_russia_sanctions_welfare_loss_data.csv",
      "fig-2_russia_welfare_loss_by_sanctioning_country_data.csv",
      "table-01_welfare_losses_russia_scenarios_data.csv",
    ],
  },
  {
    id: "germany-education-paradox",
    title: "The Education Paradox — Rising Skills, Stagnant Opportunity",
    category: "Labor Market",
    subtitle:
      "Why Higher Qualifications Aren’t Translating into Better Jobs for Europe’s Youth",
    author: "Labor Market Transitions and Gender Policy Team",
    actors: [
      "Young workers",
      "Women in caregiving roles",
      "Education policymakers",
    ],
    document_id: "dwr-24-29",
    intro:
      "While education and skill levels among youth are on the rise in Germany and across Europe, real employment opportunities remain mismatched. This story explores how educational attainment, welfare impact from global disruptions, and shifting care burdens affect labor force participation and skill utilization, particularly among the younger population.",
    sections: [
      {
        heading: "I. Skills Rise Among Youth, But So Do Employment Mismatches",
        content:
          "Germany's youth are becoming more qualified, yet employment still lags behind expectations. Parents’ employment preferences hint at a future-oriented labor vision that clashes with current economic opportunities.",
        visuals: [
          {
            id: "Fig29-01",
            title: "Youth Ideal Employment Preference vs Actual Employment",
            type: "bar",
            description:
              "Shows the mismatch between what parents ideally want for their children’s jobs versus the actual employment patterns of youth in Germany.",
            x_axis: "Employment Type",
            y_axis: "Percentage (%)",
            source: "Fig-2_germany_ideal_employment_data.csv",
          },
        ],
      },
      {
        heading: "II. Sanctions and Global Shocks Disrupt Educational Gains",
        content:
          "The war in Ukraine and associated sanctions on Russia have far-reaching consequences. One overlooked impact is how constrained educational exchanges and rising costs lower welfare and limit educational access.",
        visuals: [
          {
            id: "Tab08-01",
            title:
              "Welfare Loss from Sanctions Limiting Global Education Access",
            type: "bar",
            description:
              "Estimates the welfare loss in billions of euros under moderate and severe scenarios of disrupted global education due to geopolitical shocks.",
            x_axis: "Scenario",
            y_axis: "Welfare Loss (Billion EUR)",
            source: "table-01_welfare_losses_russia_scenarios_data.csv",
          },
        ],
      },
      {
        heading: "III. Participation Lags as Care Gaps Remain",
        content:
          "Despite a rise in qualifications, many young workers—especially women—remain trapped in care responsibilities. In regions like Southern and Western Europe, this translates into lower workforce participation.",
        visuals: [
          {
            id: "Fig29-02",
            title: "Gender Care Gap and Participation Trends",
            type: "bar",
            description:
              "Compares care burden and workforce participation rates across regions with significant youth and gender imbalances.",
            x_axis: "Region",
            y_axis: "Percentage (%)",
            source:
              "fig-2_southern_europe_care_data.csv + fig-2_western_europe_care_data.csv",
          },
        ],
      },
    ],
    visual_data: [
      {
        source_file: "Fig-2_germany_ideal_employment_data.csv",
        description:
          "Mismatch between youth employment ideals and reality in Germany.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { "Employment Type": "Ideal Full-time", Percentage: 45 },
          { "Employment Type": "Actual Full-time", Percentage: 28 },
          { "Employment Type": "Ideal Part-time", Percentage: 35 },
          { "Employment Type": "Actual Part-time", Percentage: 40 },
          { "Employment Type": "Ideal Not Working", Percentage: 20 },
          { "Employment Type": "Actual Not Working", Percentage: 32 },
        ],
      },
      {
        source_file: "table-01_welfare_losses_russia_scenarios_data.csv",
        description:
          "Welfare loss due to international sanctions’ indirect effect on educational access.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { Scenario: "Moderate", Loss: 1.5 },
          { Scenario: "Severe", Loss: 2.9 },
        ],
      },
      {
        source_file:
          "fig-2_southern_europe_care_data.csv + fig-2_western_europe_care_data.csv",
        description:
          "Care burden and participation rate comparison across European regions.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          {
            Region: "Southern Europe",
            "Care Gap": 35,
            "Participation Rate": 55,
          },
          {
            Region: "Western Europe",
            "Care Gap": 25,
            "Participation Rate": 65,
          },
        ],
      },
    ],
    references: [
      "dwr-24-29",
      "dwr-24-08",
      "dwr-24-07",
      "Fig-2_germany_ideal_employment_data.csv",
      "table-01_welfare_losses_russia_scenarios_data.csv",
      "fig-2_southern_europe_care_data.csv",
      "fig-2_western_europe_care_data.csv",
    ],
  },
  {
    id: "germany-trust-deficit",
    title: "Trust Deficit: Why Germans Are Losing Faith in Institutions",
    category: "Public Trust",

    subtitle:
      "A cross-sectional analysis of satisfaction, democracy, and perceived representation",
    author: "Public Trust and Democratic Institutions Taskforce",
    actors: [
      "German citizens",
      "Federal government",
      "Political institutions",
      "Media",
    ],
    document_id: "dwr-24-22",
    intro:
      "A growing number of Germans express dissatisfaction with democratic institutions, public policy responsiveness, and economic representation. Drawing from multiple DIW reports, this story highlights how perceptions of fairness and trust have shifted dramatically since 2020.",
    sections: [
      {
        heading: "I. Satisfaction with Political Institutions",
        content:
          "A significant portion of the German population reports low satisfaction across key policy domains. Only a minority express confidence in pension and education systems.",
        visuals: [
          {
            id: "Fig22-01",
            title: "Satisfaction with Key Policy Areas",
            type: "bar",
            description:
              "Percentage of population satisfied with pensions, healthcare, education, and environmental policy.",
            x_axis: "Policy Domain",
            y_axis: "Satisfaction (%)",
            source: "dwr-24-22, Figure 1",
          },
        ],
      },
      {
        heading: "II. Trust in Core Institutions",
        content:
          "Institutional trust varies widely. Trust in the police remains highest, while confidence in media and politics is much lower.",
        visuals: [
          {
            id: "Fig22-03",
            title: "Trust in Institutions",
            type: "bar",
            description:
              "Level of trust in key institutions like the police, federal government, Bundestag, and media.",
            x_axis: "Institution",
            y_axis: "Trust (%)",
            source: "dwr-24-22, Figure 3",
          },
        ],
      },
      {
        heading: "III. Democracy Satisfaction by Age",
        content:
          "Democratic satisfaction shows an age gradient. Older citizens report higher satisfaction levels than younger ones.",
        visuals: [
          {
            id: "Fig45-01",
            title: "Satisfaction with Democracy by Age Group",
            type: "bar",
            description:
              "Shows how democratic satisfaction varies by age bracket.",
            x_axis: "Age Group",
            y_axis: "Satisfied with Democracy (%)",
            source: "dwr-24-45, Figure 1",
          },
        ],
      },
      {
        heading: "IV. Political Representation by Social Class",
        content:
          "Perceived political representation drops significantly for low-income and low-education citizens. This fuels disenchantment and disengagement.",
        visuals: [
          {
            id: "Fig40-02",
            title: "Feeling of Political Representation by Social Group",
            type: "bar",
            description:
              "Visualizes how income and education affect perceived political representation.",
            x_axis: "Group",
            y_axis: "Feel Represented (%)",
            source: "dwr-24-40, Figure 2",
          },
        ],
      },
    ],
    visual_data: [
      {
        source_file: "dwr-24-22, Figure 1",
        description:
          "Satisfaction with pensions, healthcare, education, and environment among German citizens.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { "Policy Domain": "Pensions", "Satisfaction (%)": 34 },
          { "Policy Domain": "Healthcare", "Satisfaction (%)": 41 },
          { "Policy Domain": "Education", "Satisfaction (%)": 37 },
          { "Policy Domain": "Environment", "Satisfaction (%)": 32 },
        ],
      },
      {
        source_file: "dwr-24-22, Figure 3",
        description:
          "Levels of trust in public institutions such as the police, government, Bundestag, and media.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { Institution: "Police", "Trust (%)": 62 },
          { Institution: "Federal Government", "Trust (%)": 39 },
          { Institution: "Bundestag", "Trust (%)": 35 },
          { Institution: "Media", "Trust (%)": 29 },
        ],
      },
      {
        source_file: "dwr-24-45, Figure 1",
        description:
          "Age-wise satisfaction with the democratic process in Germany.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { "Age Group": "18–29", "Satisfied with Democracy (%)": 42 },
          { "Age Group": "30–44", "Satisfied with Democracy (%)": 48 },
          { "Age Group": "45–59", "Satisfied with Democracy (%)": 56 },
          { "Age Group": "60+", "Satisfied with Democracy (%)": 63 },
        ],
      },
      {
        source_file: "dwr-24-40, Figure 2",
        description:
          "Perceived political representation across income and education levels.",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { Group: "Low Income", "Feel Represented (%)": 28 },
          { Group: "Middle Income", "Feel Represented (%)": 41 },
          { Group: "High Income", "Feel Represented (%)": 59 },
          { Group: "Low Education", "Feel Represented (%)": 31 },
          { Group: "High Education", "Feel Represented (%)": 52 },
        ],
      },
    ],
    references: ["dwr-24-22.pdf", "dwr-24-40.pdf", "dwr-24-45.pdf"],
  },
  {
    id: "toddler-gap-family-policy",
    title: "The Toddler Gap: Why Family Policy Is Still Failing Parents",
    subtitle:
      "A data-driven look at how early childhood education, staffing, and parental leave still fall short",
    author: "Family Policy Research Team",

    publishDate: "2024-03-10",
    category: "Family Policy",
    actors: [
      "Young Parents",
      "Federal Family Ministry",
      "Childcare Providers",
      "Policy Makers",
    ],
    intro:
      "Despite years of investment, Germany still faces a significant gap in early childhood care. From long waiting lists and limited parental leave uptake to staffing bottlenecks, the promise of universal childcare remains elusive. This story reveals how structural issues across multiple fronts continue to leave families struggling.",
    sections: [
      {
        heading: "I. Access Gaps in Early Childcare",
        content:
          "Childcare access rates remain uneven across demographics. Parents with children report significantly lower satisfaction levels when asked about institutional support for balancing work and care.",
      },
      {
        heading: "II. Staffing Bottlenecks in Kita System",
        content:
          "Chronic under-staffing in early childhood education facilities leads to group closures and lower care quality. Staffing satisfaction among parents with children is markedly low.",
      },
      {
        heading: "III. Parental Leave Still Underused",
        content:
          "Despite reforms like ElterngeldPlus, uptake remains low—especially among fathers and low-income households. Cultural and financial barriers persist.",
        charts: [
          {
            title: "General and Domain Satisfaction Over Time",
            type: "line",
            data: [
              {
                Year: 2004,
                General_Life_Satisfaction: 6.75,
                Work_Satisfaction: 6.7,
                Health_Satisfaction: 6.45,
                Income_Satisfaction: 5.5,
              },
              {
                Year: 2005,
                General_Life_Satisfaction: 6.8,
                Work_Satisfaction: 6.7,
                Health_Satisfaction: 6.5,
                Income_Satisfaction: 5.5,
              },
              {
                Year: 2006,
                General_Life_Satisfaction: 6.75,
                Work_Satisfaction: 6.75,
                Health_Satisfaction: 6.5,
                Income_Satisfaction: 5.5,
              },
              {
                Year: 2007,
                General_Life_Satisfaction: 6.85,
                Work_Satisfaction: 6.75,
                Health_Satisfaction: 6.45,
                Income_Satisfaction: 5.45,
              },
              {
                Year: 2008,
                General_Life_Satisfaction: 6.9,
                Work_Satisfaction: 6.8,
                Health_Satisfaction: 6.45,
                Income_Satisfaction: 5.5,
              },
              {
                Year: 2009,
                General_Life_Satisfaction: 6.65,
                Work_Satisfaction: 6.7,
                Health_Satisfaction: 6.4,
                Income_Satisfaction: 5.6,
              },
              {
                Year: 2010,
                General_Life_Satisfaction: 7.0,
                Work_Satisfaction: 6.8,
                Health_Satisfaction: 6.5,
                Income_Satisfaction: 5.7,
              },
              {
                Year: 2011,
                General_Life_Satisfaction: 6.95,
                Work_Satisfaction: 6.95,
                Health_Satisfaction: 6.45,
                Income_Satisfaction: 5.95,
              },
              {
                Year: 2012,
                General_Life_Satisfaction: 7.1,
                Work_Satisfaction: 7.05,
                Health_Satisfaction: 6.55,
                Income_Satisfaction: 6.05,
              },
              {
                Year: 2013,
                General_Life_Satisfaction: 7.2,
                Work_Satisfaction: 7.05,
                Health_Satisfaction: 6.6,
                Income_Satisfaction: 6.2,
              },
              {
                Year: 2014,
                General_Life_Satisfaction: 7.15,
                Work_Satisfaction: 7.05,
                Health_Satisfaction: 6.6,
                Income_Satisfaction: 6.2,
              },
              {
                Year: 2015,
                General_Life_Satisfaction: 7.25,
                Work_Satisfaction: 7.1,
                Health_Satisfaction: 6.6,
                Income_Satisfaction: 6.35,
              },
              {
                Year: 2016,
                General_Life_Satisfaction: 7.2,
                Work_Satisfaction: 7.15,
                Health_Satisfaction: 6.6,
                Income_Satisfaction: 6.35,
              },
              {
                Year: 2017,
                General_Life_Satisfaction: 7.2,
                Work_Satisfaction: 7.1,
                Health_Satisfaction: 6.5,
                Income_Satisfaction: 6.45,
              },
              {
                Year: 2018,
                General_Life_Satisfaction: 7.1,
                Work_Satisfaction: 7.05,
                Health_Satisfaction: 6.4,
                Income_Satisfaction: 6.5,
              },
              {
                Year: 2019,
                General_Life_Satisfaction: 7.25,
                Work_Satisfaction: 7.25,
                Health_Satisfaction: 6.55,
                Income_Satisfaction: 6.6,
              },
              {
                Year: 2020,
                General_Life_Satisfaction: 7.3,
                Work_Satisfaction: 7.2,
                Health_Satisfaction: 6.6,
                Income_Satisfaction: 6.55,
              },
              {
                Year: 2021,
                General_Life_Satisfaction: 7.4,
                Work_Satisfaction: 7.25,
                Health_Satisfaction: 6.9,
                Income_Satisfaction: 6.85,
              },
            ],
            source_file: "fig-1_germany_satisfaction_data.csv",
          },
        ],
      },
    ],
    references: ["dwr-24-10.pdf", "dwr-24-28.pdf", "dwr-24-32.pdf"],
  },
  {
    title: "Flight Shame or Train Pain? The Carbon Cost of Travel Choices",
    author: "Climate Policy and Mobility Behavior Group",
    category: "Climate Policy",
    subtitle:
      "Despite strong climate awareness, Germans continue flying short distances — here's why",
    intro:
      "Germany’s ambitious climate goals clash with the reality of its mobility behavior. While most citizens express willingness to reduce emissions, many still choose domestic flights over trains. The reasons? High costs, inconvenient schedules, and a rail network that lags behind expectations.",
    actors: [
      "Climate-conscious travelers",
      "Deutsche Bahn & airline lobbyists",
      "Environmental economists",
    ],
    sections: [
      {
        heading: "I. The Climate Cost of Short-Haul Flights",
        content:
          "A one-hour domestic flight emits nearly 7x more CO₂ per passenger than a comparable rail trip. Yet over 15 million such flights took place in Germany in 2023, mostly under 600 km routes like Berlin–Munich and Cologne–Hamburg. This behavior undermines Germany's CO₂ reduction targets in the transport sector.",
        charts: [
          {
            title: "CO₂ Emissions by Mode of Transport",
            type: "bar",
            data: [
              { Mode: "Domestic Flight", "CO2 Emissions": 214 },
              { Mode: "Long-Distance Train (ICE)", "CO2 Emissions": 32 },
            ],
            source_file: "dwr-24-10_fig1_co2_transport.csv",
          },
        ],
      },
      {
        heading: "II. Rail Isn't Winning: Price and Performance Gaps",
        content:
          "Despite being greener, trains often lose to flights in pricing and speed. DIW pricing analysis found that on many key routes, flights were up to 30% cheaper than ICE trains booked 7–10 days in advance. Service delays and limited rural access further drive citizens toward the skies. Moreover, only 58% of rural towns have regular regional train service.",
        charts: [
          {
            title: "Flight vs Train Cost on Key Routes",
            type: "bar",
            data: [
              { Route: "Berlin–Munich", Flight: 78, Train: 112 },
              { Route: "Frankfurt–Hamburg", Flight: 69, Train: 97 },
            ],
            source_file: "dwr-24-28_fig2_train_vs_flight_prices.csv",
          },
        ],
      },
      {
        heading: "III. Policy Blind Spots: Missed Levers for Change",
        content:
          "Germany’s subsidy system still favors air travel. Airport infrastructure benefits from tax advantages, while long-distance train subsidies are fragmented. Experts point out that if train subsidies matched aviation support, average ICE prices could drop by 18% — enough to shift millions of passengers annually.",
        charts: [
          {
            title: "Mobility Investment and Price Reform Potential",
            type: "bar",
            data: [
              { Category: "Aviation Subsidies (2023)", Amount: 4.1 },
              { Category: "Train Investment Shortfall", Amount: 2.3 },
              { Category: "ICE Price Reduction Potential", Amount: 18 },
              { Category: "Rail Infrastructure Backlog", Amount: 47 },
            ],
            source_file: "dwr-24-10_fig3_mobility_investment.csv",
          },
        ],
      },
      {
        heading: "IV. Behavioral Gaps and the Missed Green Opportunity",
        content:
          "Public surveys show over 70% of Germans support climate-friendly transport policies. Yet behavior often contradicts intention. Policy tools like dynamic flight taxes, subsidies for early rail booking, and intermodal travel apps could help bridge this gap. 85% of young urban adults say they would switch to trains if prices fell below €60 per trip.",
        charts: [
          {
            title: "Public Support for Climate Travel Tools",
            type: "bar",
            data: [
              {
                Metric: "Support for Climate Travel Incentives",
                Percentage: 72,
              },
              { Metric: "Opposition to Domestic Flight Bans", Percentage: 58 },
              { Metric: "Youth Shift to Rail If <€60", Percentage: 85 },
            ],
            source_file: "dwr-24-50_fig4_behavioral_gap_survey.csv",
          },
        ],
      },
    ],
    visual_data: [
      {
        source_file: "dwr-24-10_fig1_co2_transport.csv",
        description: "CO₂ emissions comparison of flights and trains",
        chart_type: "bar",
        time_period: "past",
        data_sample: [
          { Mode: "Domestic Flight", "CO2 Emissions": 214 },
          { Mode: "Long-Distance Train (ICE)", "CO2 Emissions": 32 },
        ],
      },
      {
        source_file: "dwr-24-28_fig2_train_vs_flight_prices.csv",
        description: "Cost comparison of train vs. flight",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { Route: "Berlin–Munich", Flight: 78, Train: 112 },
          { Route: "Frankfurt–Hamburg", Flight: 69, Train: 97 },
        ],
      },
      {
        source_file: "dwr-24-10_fig3_mobility_investment.csv",
        description: "Subsidy imbalance in mobility sector",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { Category: "Aviation Subsidies (2023)", Amount: 4.1 },
          { Category: "Train Investment Shortfall", Amount: 2.3 },
          { Category: "ICE Price Reduction Potential", Amount: 18 },
          { Category: "Rail Infrastructure Backlog", Amount: 47 },
        ],
      },
      {
        source_file: "dwr-24-50_fig4_behavioral_gap_survey.csv",
        description: "Public attitude vs behavior in transport decisions",
        chart_type: "bar",
        time_period: "future",
        data_sample: [
          { Metric: "Support for Climate Travel Incentives", Percentage: 72 },
          { Metric: "Opposition to Domestic Flight Bans", Percentage: 58 },
          { Metric: "Youth Shift to Rail If <€60", Percentage: 85 },
        ],
      },
    ],
    references: ["dwr-24-10.pdf", "dwr-24-28.pdf", "dwr-24-50.pdf"],
  },

  {
    id: "germany-subsidy-mirage",
    author: "Economic Policy and Subsidy Reform Team",
    title: "Subsidy Mirage: How Tax Breaks Fail the People",
    category: "Economic Policy",
    subtitle:
      "Billions in German subsidies disproportionately benefit the rich while the poor get crumbs",
    intro:
      "Germany spends over €200 billion annually on tax exemptions and subsidies, yet many of these benefits flow to the top of the income distribution. From housing to company cars, a growing body of research shows that these subsidies are 'socially blind'—failing to support those who need them most. Calls for reform grow louder.",
    actors: [
      "Low-income taxpayers",
      "Federal subsidy councils",
      "Economic reform advocates",
    ],
    sections: [
      {
        heading: "I. Company Car Subsidies Favor the Affluent",
        content:
          "Tax breaks for company cars cost the government over €5 billion annually, but primarily benefit employees in higher tax brackets. According to DIW estimates, more than 80% of the tax advantage accrues to the top 30% of earners.",
        charts: [
          {
            title: "Distribution of Company Car Tax Benefit by Income Group",
            type: "bar",
            data: [
              {
                "Income Group": "Top 30%",
                "Share of Company Car Tax Benefit (%)": 81,
              },
              {
                "Income Group": "Bottom 70%",
                "Share of Company Car Tax Benefit (%)": 19,
              },
              { "Annual Fiscal Cost (€ Billion)": 5.3 },
            ],
            source_file: "dwr-24-06, Figure 3",
          },
        ],
      },
      {
        heading: "II. Housing Subsidies Miss the Most Vulnerable",
        content:
          "While housing benefits exist, most fiscal housing incentives—like homeowner deductions—go to middle- and high-income groups. DIW's simulations show that only 10% of total housing subsidy value reaches the bottom 20% of households.",
        charts: [
          {
            title: "Housing Subsidy Distribution by Income Quintile",
            type: "bar",
            data: [
              {
                "Income Quintile": "Bottom 20%",
                "Share of Housing Subsidy (%)": 10,
              },
              {
                "Income Quintile": "Top 20%",
                "Share of Housing Subsidy (%)": 42,
              },
            ],
            source_file: "dwr-24-24, simulated policy analysis",
          },
        ],
      },
      {
        heading: "III. DIW Proposes Redesign of Socially Blind Subsidies",
        content:
          "A policy redesign could reallocate up to €30 billion annually from regressive subsidies to targeted relief. This includes limiting tax perks for company cars and property ownership while expanding basic benefits for low-income households and renters.",
        charts: [
          {
            title: "Projected Savings from Policy Reform",
            type: "bar",
            data: [
              {
                "Policy Reform": "Cap company car tax break",
                "Projected Savings (€ Billion)": 5.3,
              },
              {
                "Policy Reform": "End homeowner tax rebate",
                "Projected Savings (€ Billion)": 12.4,
              },
              {
                "Policy Reform": "Redirect to basic support",
                "New Allocation (€ Billion)": 30.0,
              },
            ],
            source_file: "dwr-24-45, policy proposal modeling",
          },
        ],
      },
    ],
    visual_data: [
      {
        source_file: "dwr-24-06, Figure 3",
        description: "Company car tax benefit distribution",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          {
            "Income Group": "Top 30%",
            "Share of Company Car Tax Benefit (%)": 81,
          },
          {
            "Income Group": "Bottom 70%",
            "Share of Company Car Tax Benefit (%)": 19,
          },
          { "Annual Fiscal Cost (€ Billion)": 5.3 },
        ],
      },
      {
        source_file: "dwr-24-24, simulated policy analysis",
        description: "Housing subsidies across income quintiles",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          {
            "Income Quintile": "Bottom 20%",
            "Share of Housing Subsidy (%)": 10,
          },
          {
            "Income Quintile": "Top 20%",
            "Share of Housing Subsidy (%)": 42,
          },
        ],
      },
      {
        source_file: "dwr-24-45, policy proposal modeling",
        description: "Policy reforms and projected reallocation",
        chart_type: "bar",
        time_period: "future",
        data_sample: [
          {
            "Policy Reform": "Cap company car tax break",
            "Projected Savings (€ Billion)": 5.3,
          },
          {
            "Policy Reform": "End homeowner tax rebate",
            "Projected Savings (€ Billion)": 12.4,
          },
          {
            "Policy Reform": "Redirect to basic support",
            "New Allocation (€ Billion)": 30.0,
          },
        ],
      },
    ],
    references: ["dwr-24-06.pdf", "dwr-24-24.pdf", "dwr-24-45.pdf"],
  },
  {
    id: "germany-misinformation-democracy",
    author: "Digital Democracy and Misinformation Taskforce",
    category: "Digital Democracy",
    title: "Clicks Over Truth: How Misinformation Fractures Democratic Trust",
    subtitle:
      "Algorithmic amplification and growing distrust in media weaken Germany’s digital democracy",
    intro:
      "Misinformation on social media is reshaping democratic engagement in Germany. Younger generations rely increasingly on platforms like TikTok and Telegram for news, but trust in institutions and journalism is eroding—especially in Eastern states. This story examines the growing divide in media trust and its effects on political behavior and participation.",
    actors: [
      "Online users (especially under 30)",
      "Political parties",
      "News media and platforms",
    ],
    sections: [
      {
        heading: "I. Generational Trust Divide in News",
        content:
          "Only 28% of Germans under 30 express high trust in traditional news sources, compared to over 60% of those 60 and older. Young users gravitate toward digital platforms, where exposure to unverified content is higher.",
        charts: [
          {
            title: "Trust in Traditional News by Age Group",
            type: "bar",
            data: [
              { "Age Group": "Under 30", "High Trust (%)": 28 },
              { "Age Group": "30–59", "High Trust (%)": 44 },
              { "Age Group": "60+", "High Trust (%)": 61 },
            ],
            source_file: "dwr-24-22, Figure 3",
          },
        ],
      },
      {
        heading: "II. Social Media Exposure and Disinformation",
        content:
          "Political engagement via social platforms correlates with increased disinformation exposure. Telegram and TikTok users report the highest misinformation contact, especially among AfD and non-voters.",
        charts: [
          {
            title:
              "Disinformation Exposure by Platform and Political Affiliation",
            type: "bar",
            data: [
              { Platform: "Telegram", "Disinformation Exposure (%)": 63 },
              { Platform: "TikTok", "Disinformation Exposure (%)": 58 },
              { Platform: "Facebook", "Disinformation Exposure (%)": 41 },
              {
                "Party Affiliation": "AfD",
                "Reports Seeing Disinfo (%)": 66,
              },
              {
                "Party Affiliation": "Non-voter",
                "Reports Seeing Disinfo (%)": 54,
              },
            ],
            source_file: "dwr-24-45, Table 1 + Figure 2",
          },
        ],
      },
      {
        heading: "III. East–West Trust Divide Persists",
        content:
          "Trust in digital news outlets is significantly lower in Eastern Germany. While 53% of Western users trust mainstream media, only 34% in the East do—highlighting a lasting informational divide.",
        charts: [
          {
            title: "Digital News Trust and Social Media Usage by Region",
            type: "bar",
            data: [
              { Region: "West Germany", "Trust in Digital News (%)": 53 },
              { Region: "East Germany", "Trust in Digital News (%)": 34 },
              {
                Region: "West Germany",
                "Frequent Social Media Users (%)": 47,
              },
              {
                Region: "East Germany",
                "Frequent Social Media Users (%)": 65,
              },
            ],
            source_file: "dwr-24-49, Figure 1 + Table 3",
          },
        ],
      },
    ],
    visual_data: [
      {
        source_file: "dwr-24-22, Figure 3",
        description: "Trust in news by age group",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { "Age Group": "Under 30", "High Trust (%)": 28 },
          { "Age Group": "30–59", "High Trust (%)": 44 },
          { "Age Group": "60+", "High Trust (%)": 61 },
        ],
      },
      {
        source_file: "dwr-24-45, Table 1 + Figure 2",
        description:
          "Disinformation exposure by platform and party affiliation",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { Platform: "Telegram", "Disinformation Exposure (%)": 63 },
          { Platform: "TikTok", "Disinformation Exposure (%)": 58 },
          { Platform: "Facebook", "Disinformation Exposure (%)": 41 },
          { "Party Affiliation": "AfD", "Reports Seeing Disinfo (%)": 66 },
          {
            "Party Affiliation": "Non-voter",
            "Reports Seeing Disinfo (%)": 54,
          },
        ],
      },
      {
        source_file: "dwr-24-49, Figure 1 + Table 3",
        description: "Regional trust and media usage",
        chart_type: "bar",
        time_period: "present",
        data_sample: [
          { Region: "West Germany", "Trust in Digital News (%)": 53 },
          { Region: "East Germany", "Trust in Digital News (%)": 34 },
          { Region: "West Germany", "Frequent Social Media Users (%)": 47 },
          { Region: "East Germany", "Frequent Social Media Users (%)": 65 },
        ],
      },
    ],
    references: ["dwr-24-22.pdf", "dwr-24-45.pdf", "dwr-24-49.pdf"],
  },
];
