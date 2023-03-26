function statement(invoice, plays) {
  const formattedPerformances = formatPerformances(invoice.performances, plays);

  const totalAmount = getTotalAmount(formattedPerformances);
  const totalVolumeCredit = getTotalVolumeCredit(formattedPerformances);
  const statisticsByPerformance = formattedPerformances.map((_performance) => {
    return getStatisticsByPerformance(_performance, getAmountByType(_performance.type, _performance.audience))
  });

  return printResult(invoice.customer, statisticsByPerformance, totalAmount, totalVolumeCredit);
}

function formatPerformances(_performances, _plays) {
  return _performances.map((_performance) => {
    return {
      ..._performance,
      name: _plays[_performance.playID].name,
      type: _plays[_performance.playID].type,
    }
  });
}

function getTotalAmount(_formattedPerformances) {
  const amountsByType = _formattedPerformances.map((_performance) => {
    return getAmountByType(_performance.type, _performance.audience);
  });
  return amountsByType.reduce((_prev, _curr) => _prev + _curr, 0);
}

function getAmountByType(_type, _audience) {
  let amount = 0;
  switch (_type) {
    case "tragedy":
      amount = 40000;
      if (_audience > 30) {
        amount += 1000 * (_audience - 30);
      }
      return amount;
    case "comedy":
      amount = 30000;
      if (_audience > 20) {
        amount += 10000 + 500 * (_audience - 20);
      }
      return amount += 300 * _audience;
    default:
      throw new Error(`unknown type: ${_type}`);
  }
}

function getTotalVolumeCredit(_formattedPerformances) {
  const volumeCredits = _formattedPerformances.map((_performance) => {
    return getVolumeCredits(_performance.audience, _performance.type);
  });
  return volumeCredits.reduce((_prev, _curr) => _prev + _curr, 0);
}

function getStatisticsByPerformance(_performanceInfo, _amount) {
  return ` ${_performanceInfo.name}: ${formatAmount(_amount / 100)} (${_performanceInfo.audience} seats)\n`;
}

function formatAmount(_amount) {
  const format = new Intl.NumberFormat("en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format;
  return format(_amount);
}

function getVolumeCredits(_audience, _type) {
  if (_type !== 'comedy')
    return Math.max(_audience - 30, 0);

  return Math.max(_audience - 30, 0) + Math.floor(_audience / 5);
}

function printResult(_customer, _statisticsContent, _totalAmount, _totalVolumeCredit) {
  return `Statement for ${_customer}\n
    ${_statisticsContent}\n
    Amount owed is ${formatAmount(_totalAmount / 100)}\n
    You earned ${_totalVolumeCredit} credits`;
}

/*
* result
* Statement for ${invoice.customer}
* ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)
* ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)
* ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)
* Amount owed is ${format(totalAmount/100)}
* You earned ${volumeCredits} credits
* */

module.exports = statement;