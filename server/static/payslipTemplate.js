let ejs = require("ejs");
let moment = require("moment");

module.exports = (
  employeePayslip
) => {
  let parsed = JSON.parse(JSON.stringify(employeePayslip));
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
      <%
       toCurrency = function(value){
        let parsed = parseFloat(value + "").toFixed(2);
        return '$' + parsed;
        }
       toHours = function(value){ return parseFloat(value + "").toFixed(2);}
      %>
      <div id="title">RCC BPO | PAYSLIP</div>
      <div id="scope">
      <div class="scope-entry">
        <div class="title">PAY RUN</div>
        <div class="value"><%=moment(element.paymentDate).format('MMM Do, YYYY') %></div>
      </div>
      <div class="scope-entry">
        <div class="title">PAY PERIOD</div>
        <div class="value"><%=moment(element.fromDate).format('MMM Do')%> - <%=moment(element.toDate).format('MMM Do, YYYY') %></div>
      </div>
      </div>
      <div class="content">
      <div class="left-panel">
        <div id="employee">
          <div id="name">
            <%=element.employeeName%>
          </div>
          <div id="email">
            <%=element.employeeEmail%>
          </div>
        </div>
        <div class="details">
          <div class="entry">
            <div class="label">Employee ID</div>
            <div class="value"><%= element.employeeId %></div>
          </div>
          <div class="entry">
            <div class="label">Hourly Rate</div>
            <div class="value"><%=toCurrency(element.positionHourlyRate['$numberDecimal']) %></div>
          </div>
          <div class="entry">
            <div class="label">Company Name</div>
            <div class="value">RCC BPO</div>
          </div>
          <div class="entry">
            <div class="label">Date Hired</div>
            <div class="value"><%=moment(element.employeeCompany.hireDate).format('MMM Do, YYYY')  %></div>
          </div>
          <div class="entry">
            <div class="label">Position</div>
            <div class="value"><%= element.positionName %></div>
          </div>
          <div class="entry">
            <div class="label">Payroll Cycle</div>
            <div class="value"><%= element.payrollType === 'BI-WEEKLY'? 'WEEKLY' : 'SEMIMONTHLY' %></div>
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
            <div class="value"><%= element.employeeSSN %></div>
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
            <div class="value"><%=toCurrency(element.grossPayment['$numberDecimal'])%></div>
          </div>
        </div>
        <div class="contributions">
          <div class="title">Employer Contribution</div>
          <div class="entry">
            <div class="label">SSS</div>
            <div class="value"><%=toCurrency(element.ssEmployerContribution['$numberDecimal'])%></div>
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
              <div class="rate"><%=toCurrency(element.positionBaseWage*12/52)%>/WEEKLY</div>
              <div class="amount"><%=toCurrency(element.positionBaseWage*12/52)%></div>
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
              <div class="detail">WEEK 1: SYSTEM</div>
              <div class="rate"><%=toHours(element.totalSystemRegularPay[0].hours)%>hrs@<%=toCurrency(element.totalSystemRegularPay[0].rate['$numberDecimal'])%>/hr</div>
              <div class="amount"><%=toCurrency(element.totalSystemRegularPay[0].totalPayed['$numberDecimal'])%></div>
            </div>
            <div class="entry">
              <div class="label"></div>
              <div class="detail">WEEK 2: SYSTEM</div>
              <div class="rate"><%=toHours(element.totalSystemRegularPay[1].hours)%>hrs@<%=toCurrency(element.totalSystemRegularPay[1].rate['$numberDecimal'])%>/hr</div>
              <div class="amount"><%=toCurrency(element.totalSystemRegularPay[1].totalPayed['$numberDecimal'])%></div>
            </div>
            <% if(element.totalTosRegularPayHours > 0) {%>
            <div class="entry" >
              <div class="label"></div>
              <div class="detail">WEEK 1: TOS</div>
              <div class="rate"><%=toHours(element.totalTosRegularPay[0].hours)%>hrs@<%=toCurrency(element.totalTosRegularPay[0].rate['$numberDecimal'])%>/hr</div>
              <div class="amount"><%=toCurrency(element.totalTosRegularPay[0].totalPayed['$numberDecimal'])%></div>
            </div>
            <div class="entry" >
              <div class="label"></div>
              <div class="detail">WEEK 2: TOS</div>
              <div class="rate"><%=toHours(element.totalTosRegularPay[1].hours)%>hrs@<%=toCurrency(element.totalTosRegularPay[1].rate['$numberDecimal'])%>/hr</div>
              <div class="amount"><%=toCurrency(element.totalTosRegularPay[1].totalPayed['$numberDecimal'])%></div>
            </div>
            <% } %>
            <% if(element.totalSystemHolidayX1PayHours > 0) {%>
            <div class="entry">
              <div class="label"></div>
              <div class="detail">WEEK 1: SYSTEM @ 1.5</div>
              <div class="rate"><%=toHours(element.totalSystemHolidayX1Pay[0].hours)%>hrs@<%=toCurrency(element.totalSystemHolidayX1Pay[0].rate['$numberDecimal'] )%>/hr</div>
              <div class="amount"><%=toCurrency(element.totalSystemHolidayX1Pay[0].totalPayed['$numberDecimal'])%></div>
            </div>
            <div class="entry">
              <div class="label"></div>
              <div class="detail">WEEK 2: SYSTEM @ 1.5</div>
              <div class="rate"><%=toHours(element.totalSystemHolidayX1Pay[1].hours)%>hrs@<%=toCurrency(element.totalSystemHolidayX1Pay[1].rate['$numberDecimal'])%>/hr</div>
              <div class="amount"><%=toCurrency(element.totalSystemHolidayX1Pay[1].totalPayed['$numberDecimal'])%></div>
            </div>
            <% } %>
            <% if(element.totalTosHolidayX1PayHours > 0) {%>
            <div class="entry">
              <div class="label"></div>
              <div class="detail">WEEK 1: TOS@ 1.5</div>
              <div class="rate"><%=toHours(element.totalTosHolidayX1Pay[0].hours)%>hrs@<%=toCurrency(element.totalTosHolidayX1Pay[0].rate['$numberDecimal'])%>/hr</div>
              <div class="amount"> <%=toCurrency(element.totalTosHolidayX1Pay[0].totalPayed['$numberDecimal'])%></div>
            </div>
            <div class="entry">
              <div class="label"></div>
              <div class="detail">WEEK 2: TOS@ 1.5</div>
              <div class="rate"><%=toHours(element.totalTosHolidayX1Pay[1].hours)%>hrs@<%=toCurrency(element.totalTosHolidayX1Pay[1].rate['$numberDecimal'])%>/hr</div>
              <div class="amount"> <%=toCurrency(element.totalTosHolidayX1Pay[1].totalPayed['$numberDecimal'])%></div>
            </div>
            <% } %>
            <% if(element.totalSystemHolidayX2PayHours > 0) {%>
            <div class="entry">
              <div class="label"></div>
              <div class="detail">WEEK 1: SYSTEM @2.0</div>
              <div class="rate"><%=toHours(element.totalSystemHolidayX2Pay[0].hours)%>hrs@<%=toCurrency(element.totalSystemHolidayX2Pay[0].rate['$numberDecimal']) %>/hr</div>
              <div class="amount"> <%=toCurrency(element.totalSystemHolidayX2Pay[0].totalPayed['$numberDecimal'])%></div>
            </div>
            <div class="entry">
              <div class="label"></div>
              <div class="detail">WEEK 2: SYSTEM @2.0</div>
              <div class="rate"><%=toHours(element.totalSystemHolidayX2Pay[1].hours)%>hrs@<%=toCurrency(element.totalSystemHolidayX2Pay[1].rate['$numberDecimal']) %>/hr</div>
              <div class="amount"> <%=toCurrency(element.totalSystemHolidayX2Pay[1].totalPayed['$numberDecimal'])%></div>
            </div>
            <% } %>
            <% if(element.totalTosHolidayX2PayHours > 0) {%>
            <div class="entry">
              <div class="label"></div>
              <div class="detail">WEEK 1: TOS @2.0</div>
              <div class="rate"><%=toHours(element.totalTosHolidayX2Pay[0].hours)%>hrs@<%=toCurrency(element.totalTosHolidayX2Pay[0].rate['$numberDecimal']) %>/hr</div>
              <div class="amount"> <%=toCurrency(element.totalTosHolidayX2Pay[0].totalPayed['$numberDecimal'])%></div>
            </div>
            <div class="entry">
              <div class="label"></div>
              <div class="detail">WEEK 2: TOS @2.0</div>
              <div class="rate"><%=toHours(element.totalTosHolidayX2Pay[1].hours)%>hrs@<%=toCurrency(element.totalTosHolidayX2Pay[1].rate['$numberDecimal']) %>/hr</div>
              <div class="amount"> <%=toCurrency(element.totalTosHolidayX2Pay[1].totalPayed['$numberDecimal'])%></div>
            </div>
            <% } %>
          </div>
          <div class="leaves">
            <div class="entry">
              <div class="label">Other&nbsp;Payments&nbsp;[+]</div>
              <div class="detail"></div>
              <div class="rate"></div>
              <div class="amount"></div>
            </div>
            <% for(var i=0; i < element.employeeOtherpays[0].length; i++) { %>
            <% let item = element.employeeOtherpays[0][i] %>
            <div class="entry paid">
              <div class="label"></div>
              <div class="detail">Week 1: <%=item.reason%></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(item.amount)%></div>
            </div>
            <% } %>
            <% for(var i=0; i < element.employeeOtherpays[1].length; i++) { %>
            <% let item = element.employeeOtherpays[1][i] %>
            <div class="entry paid">
              <div class="label"></div>
              <div class="detail">Week 2: <%=item.reason%></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(item.amount)%></div>
            </div>
          </div>
          <% } %>
          <div class="taxable_commission">
            <div class="entry">
              <div class="label">Total&nbsp;Bonus&nbsp;[+]</div>
              <div class="detail"></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(element.totalTaxableBonus['$numberDecimal'])%></div>
            </div>
          </div>
          <div class="nti">
            <div class="entry">
              <div class="label">TAXABLE INCOME</div>
              <div class="detail"></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(element.grossBeforeCSLPayment['$numberDecimal'])%></div>
            </div>
          </div>
          <div class="non_taxable_commission">
            <div class="entry">
              <div class="label">Maternity&nbsp;&&nbsp;CSL&nbsp;[+]</div>
              <div class="detail"></div>
              <div class="rate"></div>
              <div class="amount"></div>
            </div>
            <% for(var i=0; i < element.employeeMaternities[0].length; i++) { %>
            <% let item = element.employeeMaternities[0][i] %>
            <div class="entry paid">
              <div class="label"></div>
              <div class="detail">Week 1: <%=item.reason%></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(item.amount)%></div>
            </div>
            <% } %>
            <% for(var i=0; i < element.employeeMaternities[1].length; i++) { %>
            <% let item = element.employeeMaternities[1][i] %>
            <div class="entry paid">
              <div class="label"></div>
              <div class="detail">Week 2: <%=item.reason%></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(item.amount)%></div>
            </div>
            <% } %>
            <% for(var i=0; i < element.employeeCSL[0].length; i++) { %>
            <% let item = element.employeeCSL[0][i] %>
            <div class="entry paid">
              <div class="label"></div>
              <div class="detail">Week 1: <%=item.reason%></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(item.amount)%></div>
            </div>
            <% } %>
            <% for(var i=0; i < element.employeeCSL[1].length; i++) { %>
            <% let item = element.employeeCSL[1][i] %>
            <div class="entry paid">
              <div class="label"></div>
              <div class="detail">Week 2: <%=item.reason%></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(item.amount)%></div>
            </div>
            <% } %>
          </div>
          <div class="nti" *ngIf="element.onFinalPayment === true">
            <div class="entry">
              <div class="label">FINAL PAYMENT</div>
              <div class="detail"></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(element.totalFinalPayments['$numberDecimal'])%></div>
            </div>
          </div>
          <div class="nti">
            <div class="entry">
              <div class="label">TOTAL GROSS</div>
              <div class="detail"></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(element.grossPayment['$numberDecimal'])%></div>
            </div>
          </div>
          <div class="contributions">
            <div class="entry">
              <div class="label">Social&nbsp;Contribution&nbsp;[-]</div>
              <div class="detail"></div>
              <div class="rate"></div>
              <div class="amount">(<%=toCurrency(element.ssEmployeeContribution['$numberDecimal'])%>)</div>
            </div>
          </div>
          <div class="withholding_tax">
            <div class="entry">
              <div class="label">Income&nbsp;Tax&nbsp;[-]</div>
              <div class="detail"></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(element.incomeTax['$numberDecimal'])%></div>
            </div>
          </div>
          <div class="deductions">
            <div class="entry">
              <div class="label">Total&nbsp;Deductions&nbsp;[-]</div>
              <div class="detail"></div>
              <div class="rate"></div>
              <div class="amount"></div>
            </div>
            <% for(var i=0; i < element.employeeDeductions[0].length; i++) { %>
            <% let item = element.employeeDeductions[0][i] %>
              <div class="entry">
              <div class="label"></div>
              <div class="detail"><%=item.reason%></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(item.amount)%></div>
            </div>
            <% } %>
            <% for(var i=0; i < element.employeeDeductions[1].length; i++) { %>
            <% let item = element.employeeDeductions[1][i] %>
            <div class="entry">
              <div class="label"></div>
              <div class="detail"><%=item.reason%></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(item.amount)%></div>
            </div>
             <% } %>
          </div>
          <div class="net_pay">
            <div class="entry">
              <div class="label">NET PAY</div>
              <div class="detail"></div>
              <div class="rate"></div>
              <div class="amount"><%=toCurrency(element.netPayment['$numberDecimal'])%></div>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>
    `, {
    element: parsed,
    moment: moment,
  });
};

