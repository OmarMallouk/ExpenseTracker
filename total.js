document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transaction-form');
    const transactionType = document.getElementById('transaction-type');
    const transactionAmount = document.getElementById('transaction-amount');
    const transactionDescription = document.getElementById('transaction-description');
    const transactionList = document.getElementById('transaction-list');
  

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  
    function displayTransactions() {
      transactionList.innerHTML = ''; 
      transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${new Date(transaction.date).toLocaleDateString()}</td>
          <td>${transaction.description}</td>
          <td>${transaction.type}</td>
          <td>$${transaction.amount}</td>
          <td><button onclick="deleteTransaction('${transaction.id}')">Delete</button></td>
        `;
        transactionList.appendChild(row);
      });
    }
  
    transactionForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      // Create a transaction 
      const transaction = {
        id: Date.now().toString(), 
        type: transactionType.value,
        amount: parseFloat(transactionAmount.value),
        description: transactionDescription.value,
        date: new Date().toISOString()
      };
  

      transactions.push(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
  

      transactionForm.reset();
  
      // Update the display
      displayTransactions();
    });
  

    displayTransactions();
  });
   