document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transactionForm');
    const transactionType = document.getElementById('transactionType');
    const transactionAmount = document.getElementById('transactionAmount');
    const transactionDescription = document.getElementById('transactionDescription');
    const transactionList = document.getElementById('transaction-list');
    const totalBudget = document.getElementById('budget')
    const totalIncome = document.getElementById('totalIncome');
    const totalExpense = document.getElementById('totalExpense');
    const totalBalance = document.getElementById('balance');
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let budget = parseFloat(localStorage.getItem('budget')) || 0;


    function summaryUpdate(){
        let incomes = 0;
        let expenses = 0;

        transactions.forEach(transaction =>{
            if(transaction.type === 'income'){
                incomes += transaction.amount;
            }else if(transaction.type === 'expense'){
                expenses += transaction.amount;
            }
        })

        const balance = budget + incomes - expenses;
        totalBudget.textContent = budget.toFixed(2);
        totalIncome.textContent = incomes.toFixed(2);
        totalExpense.textContent = expenses.toFixed(2);
        totalBalance.textContent = balance.toFixed(2);
    }

    document.getElementById('minB').addEventListener('click', () => filterMinMax('min'));
    document.getElementById('maxB').addEventListener('click', () => filterMinMax('max'));

    function filterMinMax(e) {
      const sortedTransactions = [...transactions].sort((a, b) => {
        return e === 'min' ? a.amount - b.amount : b.amount - a.amount;
      });
      
      displayTransactions(sortedTransactions); 
  }

    function displayTransactions(sortedTransactions = transactions) {
      transactionList.innerHTML = ''; 
      sortedTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${new Date(transaction.date).toLocaleDateString()}</td>
          <td>${transaction.description}</td>
          <td>${transaction.type}</td>
          <td>$${transaction.amount.toFixed(2)}</td>
          <td><button onclick="deleteTransaction('${transaction.id}')">Delete</button></td>
        `;
        transactionList.appendChild(row);
      });
    }
  
    function deleteTransaction(id){
        transactions = transactions.filter(transaction => transaction.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        displayTransactions();
        summaryUpdate();
    }

    transactionForm.addEventListener('submit', (e) => {
      e.preventDefault();

        const amount = parseFloat(transactionAmount.value);
        const description = transactionDescription.value;
        const type = transactionType.value;

    if (type === 'budget') {
      budget = amount;
      localStorage.setItem('budget', budget);
    } else {
  
      const transaction = {
        id: Date.now().toString(), 
        type: type,
        amount: amount,
        description: description,
        date: new Date().toISOString()
      };
  

      transactions.push(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
  
    }
      transactionForm.reset();
      displayTransactions();
      summaryUpdate()
    });
  

    displayTransactions();
    summaryUpdate();
    window.deleteTransaction = deleteTransaction;
  });
   