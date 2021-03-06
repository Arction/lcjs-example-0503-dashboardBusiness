/*
 * LightningChartJS example that showcases a business-like-Dashboard.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    ColorPalettes,
    SolidFill,
    SolidLine,
    UILayoutBuilders,
    UIElementBuilders,
    AutoCursorModes,
    AxisTickStrategies,
    emptyLine,
    emptyFill,
    AxisScrollStrategies,
    ColorRGBA,
    Themes
} = lcjs

const {
    createProgressiveTraceGenerator
} = require('@arction/xydata')

// Create styles for normal & selected graphs.
const palette = ColorPalettes.arctionWarm(2)
const mainStrokeStyle = new SolidLine().setFillStyle(new SolidFill().setColor(palette(0))).setThickness(20 / window.devicePixelRatio)
const selectedFillStyle = new SolidFill().setColor(palette(1))

// Department names 
const teams = [
    "Dev",
    "Maintenance",
    "Support",
    "Sales",
    "Marketing"
]
// 1 data-point per day
const pointResolution = 24 * 60 * 60 * 1000
// Generate data
const budgets = Promise.all(
    teams.map((_, index) => createProgressiveTraceGenerator()
        .setNumberOfPoints(365)
        .generate()
        .toPromise()
        .then(data => data.map(point => ({
            x: point.x * pointResolution,
            y: index > 0 ? Math.abs(point.y) * 100 + 100 : Math.abs(point.y) * 50 + 1800
        })))
    )
)

// Create dashboard which will host all chart and UI elements
const db = lightningChart().Dashboard({
    // theme: Themes.dark 
    numberOfRows: 3,
    numberOfColumns: 2
})

// Total 
const totalBudgetsPerTeam = budgets.then(
    teamBudgets =>
        teamBudgets.map(budgetPerTeam =>
            budgetPerTeam.reduce((sum, v) => sum + v.y, 0)
        )
)

// Create Cartesian Chart for Bars
const barChart = db.createChartXY({
    columnIndex: 0,
    rowIndex: 0,
    columnSpan: 1,
    rowSpan: 2
})
    // Disable auto cursor
    .setAutoCursorMode(AutoCursorModes.disabled)
    // Set correct chart title
    .setTitle('Total expenses for 2018 per department')
    // Disable mouse interactions
    .setMouseInteractions(false)

// Get Y axis
const axisX = barChart.getDefaultAxisX()
// Amount of pixels in chart area
const axisXSize = axisX.scale.getCellSize()
// Modify X axis
axisX
    // Disable default ticks.
    .setTickStrategy(AxisTickStrategies.Empty)
    // Disable mouse interactions
    .setMouseInteractions(false)
    // Set correct range, so that is in pixel coordinates
    .setInterval(0, axisXSize, false, true)
    // Disable auto scaling
    .setScrollStrategy(undefined)

// Modify Y axis
barChart
    .getDefaultAxisY()
    .setTitle('Expenses ($)')
    .setStrokeStyle(style => style.setThickness(0))
    .setNibStyle(emptyLine)
    .setMouseInteractions(false)
// Create series for individual lines
const bars = barChart.addSegmentSeries()
// Calculate 
const numberOfGapsBetweenBars = teams.length + 1
// Create custom ticks to mark positions of different departments bars
const customTicks = teams.map((team, i) => axisX
    // Add new custom tick
    .addCustomTick()
    // Set team name as marker text
    .setTextFormatter(_ => team)
    // Position custom tick in according with department index
    .setValue(axisXSize / numberOfGapsBetweenBars * (i + 1))
    // Style marker of custom tick
    .setMarker(marker => marker
        // Change font settings
        .setFont(fs => fs.setSize(12))
        // Change stroke style
        .setBackground(background => background
            .setStrokeStyle(emptyLine)
            .setFillStyle(emptyFill)
        )
        .setTextFillStyle(new SolidFill({ color: ColorRGBA(170, 170, 170) }))
    )
    // Disable gridstroke.
    .setGridStrokeStyle(emptyLine)
)


// Decide on an origin for DateTime axes (shared between two charts).
const dateOrigin = new Date(2018, 0, 1)

// Create chart for a single department costs distribution graph
const lineChart = db.createChartXY({
    columnIndex: 0,
    rowIndex: 2,
    columnSpan: 2,
    rowSpan: 1
})
    .setPadding({ right: 40 })
// Set the row height for the third row to take 50% of view space.
db.setRowHeight(2, 2)
// Create simple line series 
const lineSeries = lineChart
    .addLineSeries()
    .setName('Total Expenses')
    // Set selected fill color for the series
    .setStrokeStyle((style) => style.setFillStyle(selectedFillStyle))

lineChart
    .getDefaultAxisX()
    .setTickStrategy(
        AxisTickStrategies.DateTime,
        (tickStrategy) => tickStrategy.setDateOrigin(dateOrigin)
    )

// Style chart selected department costs distribution
budgets.then(
    costsOfTeams => {
        // Finds the peak value across all departments
        const max = costsOfTeams.reduce(
            (max, costs) => costs.reduce(
                (lMax, cost) => lMax > cost.y ? lMax : cost.y,
                max
            ),
            0
        )
        // Get Y axis
        lineChart
            .getDefaultAxisY().setTitle('Expenses ($)')
            // Disable auto scaling
            .setScrollStrategy(AxisScrollStrategies.fitting)
            // Set Y scale interval so that costs distribution fits
            .setInterval(0, max)
    }
)

lineSeries.setResultTableFormatter((builder, series, Xvalue, Yvalue) => {
    // Find cached entry for the figure.
    return builder
        .addRow('Total expenses')
        .addRow('Date: ' + series.axisX.formatValue(Xvalue))
        .addRow('Expenses: $' + Yvalue.toFixed(2))
})

// Create interactive Bar chart 
Promise.all([totalBudgetsPerTeam, budgets])
    .then(([values, costsOfTeams]) => {
        // Create bar for each department
        // Departments are marked by custom ticks
        const barCol = customTicks.map((tick, i) => {
            // Get custom tick position
            const pos = tick.getValue()
            // Add Line which represents bar
            // Line X position is based on custom tick value
            return bars.add({
                startX: pos,
                startY: 0,
                endX: pos,
                endY: values[i]
            })
        })
        // Create function which shows costs distribution per day for selected department
        const selectedDepartment = i => {
            // Change the chart title according to the selected department
            lineChart.setTitle(`${teams[i]} expenses per day`)
            // Remove points which belong to costs distribution of previously selected department
            lineSeries.clear()
            // Add points for costs distribution of newly selected department
            lineSeries.add(costsOfTeams[i])
            // Set main color to all bars
            barCol.forEach(bar => bar.setStrokeStyle(mainStrokeStyle))
            // Set special color for selected bar
            barCol[i].setStrokeStyle((strokeStyle) => strokeStyle.setFillStyle(selectedFillStyle))
        }
        // Attach event listener for mouse/touch events of each bar 
        barCol.forEach((bar, i) => {
            bar.onMouseEnter(() => selectedDepartment(i))
            bar.onTouchStart(() => selectedDepartment(i))
        })
        // Select the first department at initial value
        selectedDepartment(0)
    })

// Draw text field with total amount of costs and description
const column = db
    // Create a dashboard without any content, 
    // but with possibility to host any UI element
    .createUIPanel({
        columnIndex: 1,
        rowIndex: 0,
        columnSpan: 1,
        rowSpan: 1
    })
    // Add a column structure to the UI panel
    .addUIElement(UILayoutBuilders.Column)
    .setPosition({ x: 50, y: 50 })
    .setPadding({ right: 40 })

totalBudgetsPerTeam.then(teamCosts => {
    // Add the first row to the column
    const firstRow = column.addElement(UILayoutBuilders.Row)
    // Add a gap which allocates all empty space in front of text
    firstRow.addGap()
    // Add text element right after gap
    firstRow.addElement(
        UIElementBuilders.TextBox
            // Modify TextBox builder to style the text field
            .addStyler(textBox => textBox
                // Define font settings for the text box
                .setFont(fontSettings => fontSettings.setSize(75 / window.devicePixelRatio))
                // Define content of the text box
                .setText('$' + teamCosts.reduce((sum, cost) => sum + cost, 0).toFixed())
            )
    )
    // Add a gap which allocates all empty space right after text
    firstRow.addGap()
    // Add a text box to the second row of the column
    column.addElement(
        UIElementBuilders.TextBox
            // Modify TextBox builder to style the text field
            .addStyler(textBox => textBox
                .setFont(fontSettings => fontSettings.setSize(25 / window.devicePixelRatio))
                .setText("Total company expenses")
            )
    )
})

// Draw total costs distribution per days
const totalCostsChart = db
    // Create a cartesian chart
    .createChartXY({
        columnIndex: 1,
        rowIndex: 1,
        columnSpan: 1,
        rowSpan: 1
    })
    // Specify ChartXY title
    .setTitle('Total expenses per day')
    .setPadding({ right: 40 })

totalCostsChart
    .getDefaultAxisX()
    .setTickStrategy(
        AxisTickStrategies.DateTime,
        (tickStrategy) => tickStrategy.setDateOrigin(dateOrigin)
    )

const totalCost = totalCostsChart
    // Add the smooth line
    .addSplineSeries()
    .setName('Total Expenses ($)')
    // Change the thickness of the stroke
    .setStrokeStyle((strokeStyle) => strokeStyle.setThickness(2))

budgets.then(teamBudgets => {
    // Calculate total amount of costs per day
    const totalCostsPerDays = new Array(365)
    for (let i = 0; i < 365; i++) {
        totalCostsPerDays[i] = {
            x: i * pointResolution,
            y: teams.reduce((sum, _, teamIndex) => sum + teamBudgets[teamIndex][i].y, 0)
        }
    }
    // Draw a smooth line for total amount of costs per day
    totalCost
        // Hide points
        .setPointFillStyle(emptyFill)
        // Add data
        .add(totalCostsPerDays)
})
totalCost.setResultTableFormatter((builder, series, Xvalue, Yvalue) => {
    // Find cached entry for the figure.
    return builder
        .addRow('Total expenses')
        .addRow('Date: ' + series.axisX.formatValue(Xvalue))
        .addRow('Expenses: $' + Yvalue.toFixed(2))
})
totalCostsChart.getDefaultAxisY().setTitle('Expenses ($)')
