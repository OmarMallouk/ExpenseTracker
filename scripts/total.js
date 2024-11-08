document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transactionForm');
    const transactionType = document.getElementById('transactionType');
    const transactionAmount = document.getElementById('transactionAmount');
    const transactionDescription = document.getElementById('transactionDescription');
    const transactionList = document.getElementById('transaction-list');
    const totalBudget = document.getElementById('budget');
    const totalIncome = document.getElementById('totalIncome');
    const totalExpense = document.getElementById('totalExpense');
    const totalBalance = document.getElementById('balance');
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let budget = parseFloat(localStorage.getItem('budget')) || 0;
    // Handle transaction sorting by amount (min/max)
    document.getElementById('minB').addEventListener('click', () => filterMinMax('min'));
    document.getElementById('maxB').addEventListener('click', () => filterMinMax('max'));
    const userId = 1;
  
     // Fetch transactions from the backend
     axios.get(`http://localhost/ExpenseTracker/php/amount_get.php?user_id=${userId}`)
     .then(response => {
         console.log('Response from backend:', response);
         if (response.data && response.data.success &&  Array.isArray(response.data.transactions)) {
             transactions = response.data.transactions; // Set transactions from database
             console.log('Fetched transactions:', transactions);
             displayTransactions();
             summaryUpdate();
         } else {
             console.error('Error fetching transactions:', response.data.error);
         }
     })
     .catch(error => console.error('Error with axios GET request:', error));

  
    // Handle form submission
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(transactionAmount.value);
        const description = transactionDescription.value;
        const type = transactionType.value;
  
        const transaction = {
            type: type,
            amount: amount,
            description: description,
            date: new Date().toISOString()
        };
  
        axios.post('http://localhost/ExpenseTracker/php/transaction_add.php', transaction)
            .then(response => {
                if (response.data.success) {
                    console.log('Transaction saved to the database!');
                    transaction.transaction_id = response.data.transaction_id; // Ensure this ID is returned from the PHP backend
                    transactions.push(transaction);
                    transactionForm.reset();
                    displayTransactions();
                    summaryUpdate();
                } else {
                    console.error('Error saving transaction to database:', response.data.error);
                }
            })
            .catch(error => console.error('Error with axios:', error));
    });
  
  
    // Display transactions
    function displayTransactions(sortedTransactions = transactions) {
      transactionList.innerHTML = '';
      sortedTransactions.forEach(transaction => {
          const row = document.createElement('tr');
          const date = transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A';
          row.innerHTML = `
              <td>${transaction.transaction_id}</td>
              <td>${transaction.description}</td>
              <td>${transaction.type}</td>
              <td>$${transaction.amount}</td>
              <td><button onclick="deleteTransaction('${transaction.transaction_id}')">Delete</button></td>
          `;
          transactionList.appendChild(row);
      });
  }
  
  // Delete transaction function
  async function deleteTransaction(id) {
  
    if (!id) {
      console.error("Transaction ID is undefined or invalid");
      return;
      }
      console.log("Attempting to delete transaction with ID:", id);
  
      try {
        //  DELETE request 
        const response = await axios.delete(`http://localhost/ExpenseTracker/php/delete_transaction.php?id=${id}`);
  
        if (response.data.success) {
  
            // Immediately removes the transaction from frontend
            transactions = transactions.filter(transaction => transaction.transaction_id !== id);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            displayTransactions();
            summaryUpdate();
            console.log('Transaction deleted successfully');
        } else {
            console.error('Error deleting transaction:', response.data.error);
            await refresh(); 
        }
     } catch (error) {
        console.error('Error with delete request:', error);
        alert("An error occurred. Please try again.");
        await refresh(); 
     }
    }
  // Refresh transactions from the backend
  async function refresh() {
      try {
          const response = await axios.get(`http://localhost/ExpenseTracker/php/amount_get.php?user_id=${userId}`);
          if (response.data && Array.isArray(response.data)) {
              transactions = response.data;
              displayTransactions();
              summaryUpdate();
          } else {
              console.error('Error fetching transactions:', response.data.error);
          }
      } catch (error) {
          console.error('Error refreshing transactions:', error);
      }
  }
  
    // Update the summary (budget, income, expense, and balance)
    function summaryUpdate() {
        let incomes = 0;
        let expenses = 0;
  
        transactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount);
            if (transaction.type === 'income') {
                incomes += !isNaN(amount) ? amount : 0;
            } else if (transaction.type === 'expense') {
                expenses += !isNaN(amount) ? amount : 0;
            }
        });
  
        const budgetTransaction = transactions.find(transaction => transaction.type === 'budget');
        budget = budgetTransaction ? parseFloat(budgetTransaction.amount) : 0;
        const balance = budget + incomes - expenses;
        totalBudget.textContent = budget.toFixed(2);
        totalIncome.textContent = incomes.toFixed(2);
        totalExpense.textContent = expenses.toFixed(2);
        totalBalance.textContent = balance.toFixed(2);
    }
  
  
    function filterMinMax(e) {
        const sortedTransactions = [...transactions].sort((a, b) => {
            return e === 'min' ? a.amount - b.amount : b.amount - a.amount;
        });
        displayTransactions(sortedTransactions);
    }
  
    
    // Initialize transactions and summary
    displayTransactions();
    summaryUpdate();
  
    // Expose deleteTransaction globally for inline event handler
    window.deleteTransaction = deleteTransaction;
  });