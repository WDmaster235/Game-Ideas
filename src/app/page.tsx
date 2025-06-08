"use client";

import { useEffect, useState } from "react";
import Details from "./details";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState({
    title: "",
    genre: "",
    mechanics: "",
    story: "",
    art_style: "",
    audience: "",
    usp: "",
    platforms: "",
    scope: "",
    monetization: "",
    inspirations: "",
    notes: ""
  });
  const [selectedId, setSelectedId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  useEffect(() => {
    async function fetchIdeas() {
      const { data, error } = await supabase.from("game_ideas").select("*");
      if (error) {
        console.error("Error fetching ideas:", error.message);
      } else {
        setIdeas(data);
      }
    }
    fetchIdeas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;

    const { data, error } = await supabase.from("game_ideas").insert([form]).select();
    if (error) {
      console.error("Error submitting idea:", error.message);
      return;
    }
    if (!data || data.length === 0) {
      console.error("No data returned after insert");
      return;
    }

    setIdeas((prev) => [...prev, { ...form, id: data[0].id }]);
    setForm({
      title: "",
      genre: "",
      mechanics: "",
      story: "",
      art_style: "",
      audience: "",
      usp: "",
      platforms: "",
      scope: "",
      monetization: "",
      inspirations: "",
      notes: ""
    });
    setShowFormModal(false);
  };

  // Close form modal and reset form data (discard changes)
  const handleCloseFormModal = () => {
    setForm({
      title: "",
      genre: "",
      mechanics: "",
      story: "",
      art_style: "",
      audience: "",
      usp: "",
      platforms: "",
      scope: "",
      monetization: "",
      inspirations: "",
      notes: ""
    });
    setShowFormModal(false);
  };

  return (
    <>
      {/* Background content - blurred and disabled when modal is open */}
      <div
        className={`min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-10 font-sans text-gray-800 transition-filter duration-300 ${
          showFormModal || selectedId ? "filter blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {/* Submit button fixed top-right */}
        <button
          onClick={() => setShowFormModal(true)}
          className="fixed top-6 right-6 bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-800 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-400 z-10"
          aria-label="Submit an idea"
        >
          Submit an Idea
        </button>

        <h1 className="text-5xl font-extrabold mb-14 text-center text-blue-900 drop-shadow-lg tracking-wide">
          Game Ideas
        </h1>

        {/* Ideas Grid */}
        {ideas.length === 0 ? (
          <p className="text-center text-gray-500 italic mb-14">No ideas submitted yet.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-16">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                onClick={() => setSelectedId(idea.id)}
                className="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-2xl transition-shadow duration-300 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedId(idea.id)}
                aria-label={`View details for ${idea.title}`}
              >
                <h2 className="text-2xl font-semibold mb-3 text-blue-700 truncate">{idea.title}</h2>
                <p className="text-sm text-gray-600 italic select-none">Click to view details</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submission Form Modal */}
      {showFormModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-form-title"
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full p-10 shadow-2xl relative overflow-auto max-h-[90vh]">
            <button
              onClick={handleCloseFormModal}
              className="absolute top-6 right-8 text-gray-700 hover:text-gray-900 text-4xl font-extrabold focus:outline-none focus:ring-4 focus:ring-blue-400 rounded-full"
              aria-label="Close submission form"
              title="Cancel and close form"
            >
              &times;
            </button>

            <h2 id="submit-form-title" className="text-4xl font-bold mb-8 text-center text-blue-900 tracking-tight">
              Submit Your Game Idea
            </h2>

            <form
              className="space-y-7"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {Object.entries(form).map(([key, val]) => (
                <div key={key}>
                  <label
                    className="block font-semibold capitalize mb-3 text-gray-800"
                    htmlFor={key}
                  >
                    {key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                  </label>
                  <textarea
                    id={key}
                    name={key}
                    value={val}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-700 resize-none text-gray-900 placeholder-gray-400 shadow-sm"
                    rows={["mechanics", "story", "notes"].includes(key) ? 5 : 2}
                    placeholder={`Enter ${key.replace(/_/g, " ")}`}
                    required={key === "title"}
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-blue-700 text-white text-xl font-semibold py-4 rounded-lg shadow-lg hover:bg-blue-800 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-500"
              >
                Submit Idea
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start pt-24 z-50 overflow-auto px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="details-title"
        >
          <div className="bg-white rounded-3xl max-w-5xl w-full p-12 shadow-2xl relative ring-1 ring-gray-300">
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-6 right-8 text-gray-700 hover:text-gray-900 text-4xl font-extrabold focus:outline-none focus:ring-4 focus:ring-blue-400 rounded-full"
              aria-label="Close details"
              title="Close"
            >
              &times;
            </button>
            <Details id={selectedId} onClose={() => setSelectedId(null)} />
          </div>
        </div>
      )}
    </>
  );
}
