let ejs = require('ejs')
let moment = require('moment');

module.exports = ({
  employeePayslip
}) => {
  return ejs.render(`
		<style>
		body {
		background: #f0f0f0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		padding: 20px;
		height: 100%;
		}

		@import url('https://fonts.googleapis.com/css?family=Roboto:200,300,400,600,700');

		* {
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		color: #444;
		}

		#payslip {
		width: calc( 8.5in - 80px );
		height: calc( 11in - 60px );
		background: #fff;
		padding: 30px 40px;
		}

		#title {
		margin-bottom: 20px;
		font-size: 38px;
		font-weight: 600;
		}

		#scope {
		border-top: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
		padding: 7px 0 4px 0;
		display: flex;
		justify-content: space-around;
		}

		#scope > .scope-entry {
		text-align: center;
		}

		#scope > .scope-entry > .value {
		font-size: 14px;
		font-weight: 700;
		}

		.content {
		display: flex;
		border-bottom: 1px solid #ccc;
		height: 880px;
		}

		.content .left-panel {
		border-right: 1px solid #ccc;
		min-width: 200px;
		padding: 20px 16px 0 0;
		}

		.content .right-panel {
		width: 100%;
		padding: 10px 0  0 16px;
		}

		#employee {
		text-align: center;
		margin-bottom: 20px;
		}
		#employee #name {
		font-size: 15px;
		font-weight: 700;
		}

		#employee #email {
		font-size: 11px;
		font-weight: 300;
		}

		.details, .contributions, .ytd, .gross {
		margin-bottom: 20px;
		}

		.details .entry, .contributions .entry, .ytd .entry {
		display: flex;
		justify-content: space-between;
		margin-bottom: 6px;
		}

		.details .entry .value, .contributions .entry .value, .ytd .entry .value {
		font-weight: 700;
		max-width: 130px;
		text-align: right;
		}

		.gross .entry .value {
		font-weight: 700;
		text-align: right;
		font-size: 16px;
		}

		.contributions .title, .ytd .title, .gross .title {
		font-size: 15px;
		font-weight: 700;
		border-bottom: 1px solid #ccc;
		padding-bottom: 4px;
		margin-bottom: 6px;
		}

		.content .right-panel .details {
		width: 100%;
		}

		.content .right-panel .details .entry {
		display: flex;
		padding: 0 10px;
		margin: 6px 0;
		}

		.content .right-panel .details .label {
		font-weight: 700;
		width: 120px;
		}

		.content .right-panel .details .detail {
		font-weight: 600;
		width: 130px;
		}

		.content .right-panel .details .rate {
		font-weight: 400;
		width: 80px;
		font-style: italic;
		letter-spacing: 1px;
		}

		.content .right-panel .details .amount {
		text-align: right;
		font-weight: 700;
		width: 90px;
		}

		.content .right-panel .details .net_pay div, .content .right-panel .details .nti div {
		font-weight: 600;
		font-size: 12px;
		}

		.content .right-panel .details .net_pay, .content .right-panel .details .nti {
		padding: 3px 0 2px 0;
		margin-bottom: 10px;
		background: rgba(0, 0, 0, 0.04);
		}
		</style>

		<div id="payslip">
		<div id="title">Payslip</div>
		<div id="scope">
		<div class="scope-entry">
			<div class="title">PAY RUN</div>
			<div class="value">Mar 15, 2015</div>
		</div>
		<div class="scope-entry">
			<div class="title">PAY PERIOD</div>
			<div class="value">Mar 1 - Mar 15, 2015</div>
		</div>
		</div>
		<div class="content">
		<div class="left-panel">
			<div id="employee">
				<div id="name">
					Juan Sebastian Gomez
				</div>
				<div id="email">
					sgomez@rccbpo.com
				</div>
			</div>
			<div class="details">
				<div class="entry">
					<div class="label">Employee ID</div>
					<div class="value"><%= element.employeeId %></div>
				</div>
				<div class="entry">
					<div class="label">Hourly Rate</div>
					<div class="value"><%= element.hourlyRate %></div>
				</div>
				<div class="entry">
					<div class="label">Company Name</div>
					<div class="value">RCC BPO</div>
				</div>
				<div class="entry">
					<div class="label">Date Hired</div>
					<div class="value"><%= element.employeeCompany.hireDate %></div>
				</div>
				<div class="entry">
					<div class="label">Position</div>
					<div class="value"><%= element.employeePosition.name %></div>
				</div>
				<div class="entry">
					<div class="label">Payroll Cycle</div>
					<div class="value"><%= element.payrollType %></div>
				</div>
				<div class="entry">
					<div class="label">Cost Center</div>
					<div class="value">Employee Payroll</div>
				</div>
				<div class="entry">
					<div class="label">TIN</div>
					<div class="value"><%= element.employeePayroll.TIN %></div>
				</div>
				<div class="entry">
					<div class="label">SSN</div>
					<div class="value"><%= element.socialSecurity %></div>
				</div>
				<div class="entry">
					<div class="label">Prepared by</div>
					<div class="value">Finance Department</div>
				</div>
			</div>
			<div class="gross">
				<div class="title">Gross Income</div>
				<div class="entry">
					<div class="label"></div>
					<div class="value"><%= element.grossWage %></div>
				</div>
			</div>
			<div class="contributions">
				<div class="title">Employer Contribution</div>
				<div class="entry">
					<div class="label">SSS</div>
					<div class="value"><%= element.totalCompanyContributions%></div>
				</div>
			</div>
			<div class="ytd">
			</div>
		</div>
		<div class="right-panel">
			<div class="details">
				<div class="basic-pay">
					<div class="entry">
						<div class="label">Basic Pay</div>
						<div class="detail"></div>
						<div class="rate"><%= element.basicWage %>/Month</div>
						<div class="amount"><%= element.basicWage %></div>
					</div>
				</div>
				<div class="salary">
					<div class="entry">
						<div class="label">Salary</div>
						<div class="detail"></div>
						<div class="rate"></div>
						<div class="amount"></div>
					</div>
					<div class="entry">
						<div class="label"></div>
						<div class="detail">Undertime</div>
						<div class="rate"><%=element.totalRegularHours%>hrs@<%= element.hourlyRate %>/hr</div>
						<div class="amount">(<%=element.totalRegularHoursPay %>)</div>
					</div>
					<!-- <div class="entry">
						<div class="label"></div>
						<div class="detail">Unworked Holiday</div>
						<div class="rate">16hrs@259.62/hr</div>
						<div class="amount">4,153.92</div>
					</div> -->
					<div class="entry">
						<div class="label"></div>
						<div class="detail">Regular Holiday</div>
						<div class="rate"><%= element.totalHolidayHoursX1 %>hrs@<%= element.hourlyRate * 1.5 %>/hr</div>
						<div class="amount"><%= element.totalHolidayHoursX1Pay %></div>
					</div>

					<div class="entry">
						<div class="label"></div>
						<div class="detail">Special Holiday</div>
						<div class="rate"><%= element.totalHolidayHoursX2 %>hrs@<%= element.hourlyRate * 2 %>/hr</div>
						<div class="amount"><%= element.totalHolidayHoursX2Pay %></div>
					</div>
				</div>
				<div class="leaves">
					<div class="entry">
						<div class="label">Other Payments</div>
						<div class="detail"></div>
						<div class="rate"></div>
						<div class="amount"></div>
					</div>
					<div class="entry paid">
						<div class="label"></div>
						<div class="detail">Total Other Payments</div>
						<div class="rate"></div>
						<div class="amount"><%= element.totalOtherpay %></div>
					</div>
				</div>
				<div class="taxable_commission"></div>
				<div class="contributions">
					<div class="entry">
						<div class="label">Contributions</div>
						<div class="detail"></div>
						<div class="rate"></div>
						<div class="amount"></div>
					</div>
					<div class="entry">
						<div class="label"></div>
						<div class="detail">SSS</div>
						<div class="rate"></div>
						<div class="amount">(<%= element.totalEmployeeContributions %>)</div>
					</div>
				</div>
				<div class="nti">
					<div class="entry">
						<div class="label">TAXABLE INCOME</div>
						<div class="detail"></div>
						<div class="rate"></div>
						<div class="amount"><%= element.grossWage - element.totalOtherPay - element.totalBonus%></div>
					</div>
				</div>
				<div class="withholding_tax">
					<div class="entry">
						<div class="label">Withholding Tax</div>
						<div class="detail"></div>
						<div class="rate"></div>
						<div class="amount">(21,548.85)</div>
					</div>
				</div>
				<div class="non_taxable_bonus">
					<div class="entry">
						<div class="label">Non-Taxable Bonus</div>
						<div class="detail"></div>
						<div class="rate"></div>
						<div class="amount"></div>
					</div>
					<div class="entry">
						<div class="label"></div>
						<div class="detail"> Total Bonus</div>
						<div class="rate"></div>
						<div class="amount"><%= element.totalBonus %></div>
					</div>
				</div>
				<div class="deductions">
					<div class="entry">
						<div class="label">Total Deductions</div>
						<div class="detail"></div>
						<div class="rate"></div>
						<div class="amount"></div>
					</div>
					<div class="entry">
						<div class="label"></div>
						<div class="detail">Deduction Amount</div>
						<div class="rate"></div>
						<div class="amount">(<%= element.totalDeductions %>)</div>
					</div>
				</div>
				<div class="net_pay">
					<div class="entry">
						<div class="label">NET PAY</div>
						<div class="detail"></div>
						<div class="rate"></div>
						<div class="amount"><%= element.totalPayed %></div>
					</div>
				</div>
			</div>
		</div>
		</div>
		</div>
    `, {
    element: employeePayslip,
    moment: moment
  });
}

