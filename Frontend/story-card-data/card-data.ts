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
];
