import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";

// Define Expense type
interface Expense {
  id: string;
  [key: string]: any;
}
interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}
// Initial state
const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
};

// Thunk to fetch expenses
const fetchExpenses = createAsyncThunk<Expense[]>(
  "expenses/fetchExpenses",
  async () => {
    const querySnapshot = await getDocs(collection(db, "expenses"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
);

// Expense slice
const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch expenses";
      });
  },
});

export default expenseSlice.reducer;
export { fetchExpenses };
