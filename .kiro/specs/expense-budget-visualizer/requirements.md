# Requirements Document

## Introduction

The Expense & Budget Visualizer is a client-side single-page web application that lets users record, categorize, sort, and visualize personal spending. All data is persisted in the browser's localStorage so the app works fully offline without a backend. Users can track expenses by category, view a pie chart of spending distribution, manage custom categories, and switch between light and dark themes.

## Glossary

- **App**: The Expense & Budget Visualizer single-page web application.
- **Transaction**: A single expense entry consisting of an item name, a numeric amount in Indonesian Rupiah (Rp), and a category.
- **Category**: A named label used to group transactions. Categories are user-managed and persisted across sessions.
- **Total_Balance**: The running sum of all transaction amounts currently stored.
- **Chart**: The Chart.js pie chart displaying spending totals grouped by category.
- **Storage**: The browser's `localStorage` API used to persist transactions, categories, and theme preference.
- **Theme**: The visual color scheme of the App, either `light` or `dark`.
- **Sort_Order**: The user-selected ordering applied to the transaction list display.
- **Validator**: The client-side logic that checks form inputs before a transaction is accepted.
- **Category_Manager**: The logic responsible for adding, deduplicating, and persisting categories.
- **Color_Palette**: The fixed ordered set of seven colors cycled by category index to visually distinguish categories.

---

## Requirements

### Requirement 1: Transaction Entry

**User Story:** As a user, I want to add expense transactions with a name, amount, and category, so that I can record my spending.

#### Acceptance Criteria

1. THE App SHALL provide a form containing a text input for the item name (maximum 100 characters), a numeric input for the amount (accepting values from 0.01 to 999,999,999.99), and a category dropdown populated with the available categories.
2. WHEN the user submits the form with a non-empty item name, an amount greater than zero, and a selected category, THE App SHALL create a Transaction with a unique id (distinct from all existing Transaction ids in the stored transaction list), the entered name, the entered amount, and the selected category.
3. WHEN the user submits the form with a non-empty item name, an amount greater than zero, and a selected category, THE App SHALL append the new Transaction to the stored transaction list.
4. WHEN the user submits the form with a non-empty item name, an amount greater than zero, and a selected category, THE App SHALL reset the item name input to an empty string, the amount input to empty, and the category dropdown to its unselected placeholder state after the Transaction is saved.
5. IF the user submits the form with an empty item name, THEN THE Validator SHALL display the message "Fill in the item name, a valid amount, and a category." in the error area and SHALL NOT create a Transaction.
6. IF the user submits the form with an amount that is zero, negative, or non-numeric, THEN THE Validator SHALL display the message "Fill in the item name, a valid amount, and a category." in the error area and SHALL NOT create a Transaction.
7. IF the user submits the form without selecting a category, THEN THE Validator SHALL display the message "Fill in the item name, a valid amount, and a category." in the error area and SHALL NOT create a Transaction.
8. WHEN a Transaction is successfully added, THE Validator SHALL clear any previously displayed error message.

---

### Requirement 2: Transaction Persistence

**User Story:** As a user, I want my transactions to be saved between browser sessions, so that I do not lose my spending history when I close or refresh the page.

#### Acceptance Criteria

1. WHEN a Transaction is created or deleted, THE Storage SHALL serialize the updated transaction list to `localStorage` under the key `ebv_transactions`.
2. WHEN the App initializes, THE Storage SHALL deserialize the transaction list from `localStorage` key `ebv_transactions` and restore it as the active transaction list.
3. IF the `localStorage` entry for `ebv_transactions` is absent, contains malformed JSON, or contains a value that is not an array, THEN THE Storage SHALL initialize the active transaction list as an empty array.
4. IF serializing or writing to `localStorage` fails, THEN THE Storage SHALL retain the current in-memory transaction list unchanged and indicate the persistence failure to the App.

---

### Requirement 3: Transaction Deletion

**User Story:** As a user, I want to delete individual transactions, so that I can correct mistakes or remove outdated entries.

#### Acceptance Criteria

1. THE App SHALL render a delete button alongside each Transaction in the transaction list.
2. WHEN the user activates the delete button for a Transaction, THE App SHALL remove that Transaction from the stored transaction list.
3. WHEN a Transaction is removed, THE Storage SHALL persist the updated transaction list to `localStorage` under the key `ebv_transactions`.
4. WHEN a Transaction is removed, THE App SHALL update the Total_Balance display, the transaction list, and the Chart to reflect the deletion.

---

### Requirement 4: Total Balance Display

**User Story:** As a user, I want to see the total sum of all my expenses at a glance, so that I know how much I have spent overall.

#### Acceptance Criteria

1. THE App SHALL display a Total_Balance value in the page header formatted as `Rp [amount]` using Indonesian locale digit grouping (e.g., `Rp 25.000`).
2. WHEN a Transaction is added or deleted, THE App SHALL recalculate and display the updated Total_Balance as the sum of all transaction amounts.
3. IF no transactions exist, THEN THE App SHALL display `Rp 0` as the Total_Balance.

---

### Requirement 5: Category Management

**User Story:** As a user, I want to create and manage spending categories, so that I can organize my transactions in a way that fits my lifestyle.

#### Acceptance Criteria

1. THE App SHALL initialize the category list with the default categories: `Food`, `Transport`, and `Fun`.
2. THE App SHALL populate the category dropdown in the transaction form with all categories in the category list.
3. WHEN the user enters a non-empty category name of at most 50 characters and activates "Add category", THE Category_Manager SHALL append the new category to the category list, persist the updated list to `localStorage` under the key `ebv_categories`, refresh the category dropdown, and select the newly added category in the dropdown.
4. IF the user enters a category name that matches an existing category name (case-insensitive) and activates "Add category", THEN THE Category_Manager SHALL display the message "That category already exists." in the error area and SHALL NOT add a duplicate entry.
5. IF the user activates "Add category" with an empty input, THEN THE Category_Manager SHALL take no action.
6. WHEN the App initializes, THE Storage SHALL deserialize the category list from `localStorage` key `ebv_categories` and restore it as the active category list.
7. IF the `localStorage` entry for categories is absent or contains malformed JSON, THEN THE Storage SHALL initialize the category list with the default categories: `Food`, `Transport`, and `Fun`.
8. IF the user enters a category name exceeding 50 characters and activates "Add category", THEN THE Category_Manager SHALL display an error message indicating the name is too long and SHALL NOT add the category.

---

### Requirement 6: Spending Chart

**User Story:** As a user, I want to see a pie chart of my spending by category, so that I can understand where my money is going at a glance.

#### Acceptance Criteria

1. THE App SHALL render a pie chart that displays one segment per category that has at least one Transaction, where each segment's size is proportional to the total amount of transactions in that category.
2. THE Chart SHALL assign colors to categories using the Color_Palette cycled by category index position in the category list.
3. WHEN a Transaction is added or deleted, THE App SHALL redraw the Chart to reflect the updated category totals.
4. IF no transactions exist, THEN THE App SHALL hide the Chart canvas and display the empty-state message "No spending yet. Add a transaction to see the chart."
5. WHEN at least one Transaction exists, THE App SHALL show the Chart canvas and hide the empty-state message.
6. IF the Chart rendering library is unavailable at initialization, THEN THE App SHALL hide the Chart canvas and display the empty-state message "No spending yet. Add a transaction to see the chart."

---

### Requirement 7: Transaction List Display

**User Story:** As a user, I want to see a list of all my transactions with their details, so that I can review my spending history.

#### Acceptance Criteria

1. THE App SHALL render each Transaction in the transaction list showing the item name, the category label, the amount formatted as `Rp` followed by the numeric value with dots as thousand separators (e.g., `Rp 25.000`), a colored dot whose fill color matches the category's assigned palette color, and a delete button.
2. WHEN the transaction list is rendered, THE App SHALL apply the active Sort_Order; IF no Sort_Order has been explicitly selected, THEN THE App SHALL default to `Newest`.
3. WHEN no transactions exist, THE App SHALL hide the transaction list and display the empty-state message "No transactions yet."
4. WHEN at least one Transaction exists, THE App SHALL show the transaction list and hide the empty-state message.
5. THE App SHALL constrain the transaction list to a maximum visible height of 320px and enable vertical scrolling for overflow.

---

### Requirement 8: Transaction Sorting

**User Story:** As a user, I want to sort my transaction list by different criteria, so that I can find or review entries more easily.

#### Acceptance Criteria

1. THE App SHALL provide a sort dropdown with the options: `Newest`, `Amount: high to low`, `Amount: low to high`, and `Category`, with `Newest` selected as the default on initialization.
2. WHEN the Sort_Order is set to `Newest`, THE App SHALL sort transactions by id in descending order (most recently added first).
3. WHEN the Sort_Order is set to `Amount: high to low`, THE App SHALL sort transactions by amount in descending order.
4. WHEN the Sort_Order is set to `Amount: low to high`, THE App SHALL sort transactions by amount in ascending order.
5. WHEN the Sort_Order is set to `Category`, THE App SHALL sort transactions alphabetically by category name in ascending order.
6. WHEN the user changes the sort dropdown selection, THE App SHALL re-render the transaction list in the newly selected Sort_Order without requiring further user action.

---

### Requirement 9: Theme Support

**User Story:** As a user, I want to switch between light and dark visual themes, so that I can use the app comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE App SHALL support two themes: `light` and `dark`, controlled by a `data-theme` attribute on the root `<html>` element.
2. THE App SHALL provide a toggle button in the header that switches the active Theme between `light` and `dark`.
3. WHEN the Theme is `dark`, THE App SHALL display the toggle button label as `Light`.
4. WHEN the Theme is `light`, THE App SHALL display the toggle button label as `Dark`.
5. WHEN the user activates the theme toggle button, THE Storage SHALL persist the new Theme value to `localStorage` under the key `ebv_theme`.
6. WHEN the App initializes, THE Storage SHALL read the Theme value from `localStorage` key `ebv_theme`; IF a value is found, THEN THE App SHALL set the `data-theme` attribute on the root `<html>` element to that value and update the toggle button label accordingly; IF no value is stored, THEN THE App SHALL default to the `light` theme.

---

### Requirement 10: Responsive Layout

**User Story:** As a user, I want the app to be usable on both desktop and mobile screens, so that I can track expenses from any device.

#### Acceptance Criteria

1. THE App SHALL constrain the main content area to a maximum width of 520px and center it horizontally on the viewport.
2. THE App SHALL use a single-column layout for all sections at all viewport widths within the 520px constraint.
3. THE App SHALL apply 16px padding and 16px gap spacing between sections so that no content is clipped or overlaps at viewport widths at or above 320px.
