// react-orgchart.d.ts
declare module "@dabeng/react-orgchart" {
    import * as React from "react";

    interface OrgChartProps {
        datasource: any; // You can type this better if you want
        pan?: boolean;
        zoom?: boolean;
        draggable?: boolean;
        collapsible?: boolean;
        chartClass?: string;
        nodeTemplate?: (nodeData: any) => React.ReactNode;
    }

    const OrgChart: React.FC<OrgChartProps>;

    export default OrgChart;
}
