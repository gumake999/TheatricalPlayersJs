// 금액 포맷팅
const format = new Intl.NumberFormat("en-US",
  {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2
  }).format;

function statement(invoice, plays) {
  const combinedData = combineInvoiceAndPlays(invoice.performances, plays);

  const dataByPerformance = getStatementByPerformances(combinedData);
  const totalAmount = getTotalAmount(combinedData);
  const volumeCredits = getTotalVolumeCredits(combinedData);

  return printResult(invoice.customer, dataByPerformance, totalAmount, volumeCredits);
}

// 사용할 데이터 포맷팅
const combineInvoiceAndPlays = (_performance, _plays) => {
  return _performance.map((_performance) => {
    return {
      name: _plays[_performance.playID].name,
      audience: _performance.audience,
      type: _plays[_performance.playID].type,
    }
  });
}

class Tragedy {
  constructor(_audience) {
    this.audience = _audience;
  }

  getAmount() {
    let amount = 40000;
    if (this.audience > 30)
      amount += 1000 * (this.audience - 30);

    return amount;
  }

  getAudience() {
    return this.audience;
  }

  getVolumeCredits() {
    return Math.max(this.audience - 30, 0);
  }
}

class Comedy {
  constructor(_audience) {
    this.audience = _audience;
  }

  getAmount() {
    let amount = 30000;
    if (this.audience > 20)
      amount += 10000 + 500 * (this.audience - 20);
    amount += 300 * this.audience;

    return amount;
  }

  getAudience() {
    return this.audience;
  }

  getVolumeCredits() {
    return Math.max(this.audience - 30, 0) + Math.floor(this.audience / 5);
  }
}

// 타입별 getAmount 실행 분기
function getAmountByType(_data) {
  const { type, audience } = _data;

  switch (type) {
    case 'tragedy':
      const tragedy = new Tragedy(audience);
      return tragedy.getAmount();
    case 'comedy':
      const comedy = new Comedy(audience);
      return comedy.getAmount();
    default:
      throw new Error(`unknown type: ${type}`);
  }
}

// 타입별 getAudience 실행 분기
function getAudienceByType(_data) {
  const { type, audience } = _data;

  switch (type) {
    case 'tragedy':
      const tragedy = new Tragedy(audience);
      return tragedy.getAudience();
    case 'comedy':
      const comedy = new Comedy(audience);
      return comedy.getAudience();
    default:
      throw new Error(`unknown type: ${type}`);
  }
}

// 타입별 getVolumeCredits 실행 분기
function getVolumeCreditByType(_data) {
  const { type, audience } = _data;

  switch (type) {
    case 'tragedy':
      const tragedy = new Tragedy(audience);
      return tragedy.getVolumeCredits();
    case 'comedy':
      const comedy = new Comedy(audience);
      return comedy.getVolumeCredits();
    default:
      throw new Error(`unknown type: ${type}`);
  }
}

// 총 totalAmount 구하기
function getTotalAmount(_datas) {
  const amounts = _datas.map((_data) => getAmountByType(_data));

  return amounts.reduce((_pre, _cur) => _pre + _cur, 0);
}

// 총 volumeCredits 구하기
function getTotalVolumeCredits(_datas) {
  const volumeCredits = _datas.map((_data) => getVolumeCreditByType(_data));

  return volumeCredits.reduce((_pre, _cur) => _pre + _cur, 0);
}

// 공연별 집계 데이터
function getStatementByPerformances(_datas) {
  return _datas.map((_data) => {
    return {
      name: _data.name,
      amount: getAmountByType(_data),
      audience: getAudienceByType(_data),
    }
  })
}

// 출력
function printResult(_customer, _dataByPerformance, _totalAmount, _volumeCredit) {
  let result = `Statement for ${_customer}\n`;

  _dataByPerformance.forEach((_performance) => {
    result += `${_performance.name}: ${format(_performance.amount / 100)} (${_performance.audience} seats)\n`;
  });

  result += `Amount owed is ${format(_totalAmount / 100)}\nYou earned ${_volumeCredit} credits\n`;

  return result;
}

module.exports = statement;


/**
 * result
 * Statement for ${invoice.customer}
 * ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)
 * ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)
 * ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)
 * Amount owed is ${format(totalAmount/100)}
 * You earned ${volumeCredits} credits
 */
