"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Details({ id }) {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setIdea(null);
      return;
    }

    async function fetchIdea() {
      setLoading(true);
      const { data, error } = await supabase
        .from("game_ideas")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error) {
        console.error("Error fetching idea:", error.message);
        setIdea(null);
      } else {
        setIdea(data);
      }
      setLoading(false);
    }

    fetchIdea();
  }, [id]);

  if (!id) return null;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 text-xl font-medium">
        Loading...
      </div>
    );

  if (!idea)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-600 text-lg font-semibold">
        Error: Could not load idea.
      </div>
    );

  return (
    <div
      className="min-h-[60vh] p-6 font-sans text-gray-900"
    >
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-8 drop-shadow-md">
        {idea.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          ["Genre", idea.genre],
          ["Mechanics", idea.mechanics],
          ["Story", idea.story],
          ["Art Style", idea.art_style],
          ["Audience", idea.audience],
          ["USP", idea.usp],
          ["Platforms", idea.platforms],
          ["Scope", idea.scope],
          ["Monetization", idea.monetization],
          ["Inspirations", idea.inspirations],
          ["Notes", idea.notes],
        ].map(([label, value]) => (
          <section
            key={label}
            className="bg-white bg-opacity-90 backdrop-blur-sm p-5 rounded-xl shadow-md min-h-[90px] flex flex-col"
          >
            <h3 className="font-semibold text-lg mb-2 text-indigo-900">{label}</h3>
            <p className="whitespace-pre-wrap text-gray-700 flex-grow">
              {value || <span className="italic text-gray-400">None provided</span>}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
