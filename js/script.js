let customers;
let transactions;
let detailsBtns;
let chart;
const transactionChartCtx = document.getElementById('transactionChart').getContext('2d');
async function getData(){
    const response = await fetch('https://amiraelsa3id.github.io/api/data.json');
    const data = await response.json();
    customers = data.customers;
    transactions = data.transactions;
console.log(data);
await display(customers,transactions);

detailsBtns= await document.querySelectorAll(".details-btn")
detailsBtns.forEach(btn => {
    btn.addEventListener("click", async function(e){
        $(btn).parent().next().slideToggle(300);
    })
})
console.log(detailsBtns)
}

async function display(customers, transactions){
    displayChart(1);
let box=``;
let details=``;
customers.forEach(function(customer){
    const customerTransactions = transactions.filter(t => t.customer_id === customer.id);
    let dates =customerTransactions.map(t => t.date);
    const amounts = customerTransactions.map(t => t.amount);
    console.log(dates,amounts)
    console.log(customerTransactions)
   
    let data=JSON.stringify(customerTransactions)
    customerTransactions.forEach(function(ele){
        details+=`
        <div class=" col-md-6 d-flex justify-content-around">
            <div class="text-secondary">Date :</div>
            <div>${ele.date}</div>
        </div>
        <div class=" col-md-6 d-flex justify-content-around">
            <div class="text-secondary">Amount :</div>
            <div>${ele.amount}</div>
        </div>
       `
    //    <div class="col-md-6">Date : ${ele.date}</div>
    //    <div class="col-md-6">Amount : ${ele.amount}</div>
    });
    box+=`
            <div  class="col-md-12 customer-data">
            <div  class="row g-3 text-center m-auto ">
                <div class="col">${customer.name}</div>
                <div class="col">${customerTransactions.reduce((sum, t) => sum + t.amount, 0)}</div>
                <div class="col "> <a href="#" class="btn details-btn me-2">Details</a>
                <a href="#" onclick="displayChart(${customer.id})" class="btn ">chart</a></div>
                <div class="details">
                <div class="row g-3 text-start">
                    ${details}
                </div>
            </div>
            </div>
            
        </div>
    `
    details=``;
})

$('.data').html(box)
}

const displayChart = (id) => {
    const customerTransactions = transactions.filter(t => t.customer_id === id);
    let dates =customerTransactions.map(t => t.date);
    const amounts = customerTransactions.map(t => t.amount);
    
   let uname = customers.find((customer)=>{return (customer.id===id)}).name
  

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(transactionChartCtx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `Transaction Amount for ${uname}`,
                data: amounts,
                borderColor: '#6BC086',
                borderWidth: 3,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }
            }
        }
    });
};
document.querySelector('.search').addEventListener('input', (e) => {
    const filterValue = e.target.value.toLowerCase();
    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(filterValue)
    );
    const filteredTransactions = transactions.filter(transaction => 
        transaction.amount.toString().includes(filterValue)
    );

    const combinedFilteredCustomers = customers.filter(customer => 
        filteredTransactions.some(transaction => transaction.customer_id === customer.id) || 
        customer.name.toLowerCase().includes(filterValue)
    );

    display(combinedFilteredCustomers, transactions);
    detailsBtns=  document.querySelectorAll(".details-btn")
detailsBtns.forEach(btn => {
    btn.addEventListener("click", async function(e){
        $(btn).parent().next().slideToggle(300);
    })
})
});


getData();