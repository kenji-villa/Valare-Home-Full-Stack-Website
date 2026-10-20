import { useState, useEffect } from "react";
import { Search, ArrowUpDown, User } from "lucide-react";
import { getAllCustomers } from "../../../services/authService";

export default function Customers({ darkMode }) {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getAllCustomers();
      if (response.success) {
        setCustomers(response.customers);
        setFilteredCustomers(response.customers);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Search
  useEffect(() => {
    const results = customers.filter((customer) => {
      const fullName =
        `${customer.profile?.firstName || ""} ${customer.profile?.lastName || ""}`.toLowerCase();
      const username = (customer.username || "").toLowerCase();
      const email = (customer.email || "").toLowerCase();
      const search = searchTerm.toLowerCase();

      return (
        fullName.includes(search) ||
        username.includes(search) ||
        email.includes(search)
      );
    });
    setFilteredCustomers(results);
  }, [searchTerm, customers]);

  // Handle Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredCustomers].sort((a, b) => {
      let aVal, bVal;

      if (key === "name") {
        aVal = `${a.profile?.firstName || a.username}`.toLowerCase();
        bVal = `${b.profile?.firstName || b.username}`.toLowerCase();
      } else if (key === "country") {
        aVal = (a.profile?.address?.country || "").toLowerCase();
        bVal = (b.profile?.address?.country || "").toLowerCase();
      } else {
        aVal = (a[key] || "").toLowerCase();
        bVal = (b[key] || "").toLowerCase();
      }

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredCustomers(sorted);
  };

  // Helper to get initials for avatar fallback
  const getInitials = (customer) => {
    if (customer.profile?.firstName && customer.profile?.lastName) {
      return `${customer.profile.firstName[0]}${customer.profile.lastName[0]}`.toUpperCase();
    }
    return customer.username
      ? customer.username.substring(0, 2).toUpperCase()
      : "U";
  };

  // Helper to get display name
  const getDisplayName = (customer) => {
    if (customer.profile?.firstName || customer.profile?.lastName) {
      return `${customer.profile.firstName || ""} ${customer.profile.lastName || ""}`.trim();
    }
    return customer.username;
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-2xl shadow-sm border overflow-hidden`}
    >
      {/* Top Bar: Search & Sort */}
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 dark:border-gray-700">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-200"
            }`}
          />
        </div>

        <button
          onClick={() => handleSort("name")}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <ArrowUpDown className="w-4 h-4" />
          Sort by Name
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className={darkMode ? "bg-gray-700/50" : "bg-gray-50"}>
            <tr>
              <th
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-[#DA4C2F]"
                >
                  Name <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                <button
                  onClick={() => handleSort("email")}
                  className="flex items-center gap-1 hover:text-[#DA4C2F]"
                >
                  Email <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Phone
              </th>
              <th
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                <button
                  onClick={() => handleSort("country")}
                  className="flex items-center gap-1 hover:text-[#DA4C2F]"
                >
                  Country <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                <button
                  onClick={() => handleSort("country")}
                  className="flex items-center gap-1 hover:text-[#DA4C2F]"
                >
                  City <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-100"}`}
          >
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center">
                  <div className="w-8 h-8 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className={`px-6 py-10 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  No customers found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr
                  key={customer._id}
                  className={`transition-colors ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"}`}
                >
                  {/* Name & Avatar */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {customer.profile?.avatar ? (
                        <img
                          src={customer.profile.avatar}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#f0dfc8] text-[#8b6b4a] flex items-center justify-center font-bold text-sm">
                          {getInitials(customer)}
                        </div>
                      )}
                      <div>
                        <p
                          className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          {getDisplayName(customer)}
                        </p>
                        <p
                          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          @{customer.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {customer.email}
                  </td>

                  {/* Phone */}
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {customer.profile?.phone || "-"}
                  </td>

                  {/* Country */}
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {customer.profile?.address?.country || "-"}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {customer.profile?.address?.city || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
