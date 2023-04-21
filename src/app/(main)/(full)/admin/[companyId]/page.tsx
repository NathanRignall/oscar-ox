// do not cache this page
export const revalidate = 0;

// Page
export default function Company() {
  // list for inbox
  const inbox = [
    {
      id: 1,
      name: "Nathan Rignall",
    },
    {
      id: 2,
      name: "John Doe",
    },
    {
      id: 3,
      name: "Jane Doe",
    },
  ];

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>

      <section className="mt-4">
        <h2 className="text-2xl font-bold text-slate-900">Contact Inbox</h2>

        <div className="mt-4 border-2 border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left divide-y divide-gray-200">
            <thead className="text-xs font-semibold text-gray-500 bg-slate-50 uppercase">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Name
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200">
              {inbox.map((item) => (
                <tr key={item.id} className="bg-white hover:bg-gray-50">
                  <th
                    scope="row"
                    className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {item.name}
                  </th>

                  <td className="px-4 py-4 text-right">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
