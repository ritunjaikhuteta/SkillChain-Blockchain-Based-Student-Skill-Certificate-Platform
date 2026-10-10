"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { apiRequest, SkillSuggestion } from "@/lib/api";
import { Sparkles, Check, ChevronRight } from "lucide-react";

// Curated client-side list for instant (0ms latency) suggestions even before network roundtrip
export const STATIC_SKILL_CATALOG: SkillSuggestion[] = [
  // J Skills (Directly addresses "if i write j it should show all the skills that starts with j")
  { name: "Java", category: "Backend", description: "Object-oriented language for enterprise and JVM backends" },
  { name: "JavaScript", category: "Frontend", description: "Dynamic scripting language of the web and modern stacks" },
  { name: "Jenkins", category: "Cloud / DevOps", description: "Open-source automation server for CI/CD pipelines" },
  { name: "Jest", category: "Other", description: "Delightful JavaScript & TypeScript testing framework" },
  { name: "JPA / Hibernate", category: "Backend", description: "Java Persistence API object-relational mapping standard" },
  { name: "JSON", category: "Other", description: "JavaScript Object Notation data exchange standard" },
  { name: "JUnit", category: "Other", description: "Standard unit testing framework for Java applications" },
  { name: "JWT", category: "Backend", description: "JSON Web Tokens for stateless cryptographically signed auth" },
  { name: "Julia", category: "AI / ML", description: "High-performance language for numerical computing and science" },
  { name: "Jira", category: "Other", description: "Agile issue tracking and workflow management platform" },
  { name: "jQuery", category: "Frontend", description: "Classic lightweight DOM manipulation and event library" },
  { name: "Jupyter Notebook", category: "AI / ML", description: "Interactive web notebook for Python data science" },

  // Frontend
  { name: "React", category: "Frontend", description: "Component-based declarative UI library" },
  { name: "Next.js", category: "Frontend", description: "Full-stack React framework with SSR & App Router" },
  { name: "TypeScript", category: "Frontend", description: "Statically typed superset of JavaScript" },
  { name: "Tailwind CSS", category: "Frontend", description: "Utility-first CSS framework for rapid UI styling" },
  { name: "Vue.js", category: "Frontend", description: "Progressive, approachable frontend framework" },
  { name: "Angular", category: "Frontend", description: "Enterprise-grade TypeScript web application platform" },
  { name: "HTML5", category: "Frontend", description: "Semantic markup language of the World Wide Web" },
  { name: "CSS3", category: "Frontend", description: "Cascading style sheets with flexbox and CSS grid" },
  { name: "Redux", category: "Frontend", description: "Predictable state container for JavaScript apps" },
  { name: "Svelte", category: "Frontend", description: "Compiler-based reactive web application framework" },
  { name: "Vite", category: "Frontend", description: "High-speed frontend development tool and bundler" },

  // Backend
  { name: "Spring Boot", category: "Backend", description: "Enterprise production-ready Java backend framework" },
  { name: "Node.js", category: "Backend", description: "V8 asynchronous event-driven JavaScript server runtime" },
  { name: "Express.js", category: "Backend", description: "Fast, minimalist web framework for Node.js" },
  { name: "FastAPI", category: "Backend", description: "High-performance asynchronous Python API framework" },
  { name: "Django", category: "Backend", description: "High-level batteries-included Python web framework" },
  { name: "Go / Golang", category: "Backend", description: "Statically typed concurrent systems language by Google" },
  { name: "Rust", category: "Backend", description: "Memory-safe systems programming language without GC" },
  { name: "C#", category: "Backend", description: "Modern object-oriented language for Microsoft .NET" },
  { name: ".NET Core", category: "Backend", description: "Cross-platform high-performance framework by Microsoft" },
  { name: "Kotlin", category: "Backend", description: "Concise statically typed JVM and Android language" },
  { name: "PHP", category: "Backend", description: "Widely-used server-side web scripting language" },
  { name: "Ruby on Rails", category: "Backend", description: "Full-stack convention-over-configuration framework" },
  { name: "GraphQL", category: "Backend", description: "Declarative data query and manipulation language for APIs" },
  { name: "REST APIs", category: "Backend", description: "Representational State Transfer web architecture" },
  { name: "Microservices", category: "Backend", description: "Distributed modular cloud service architecture" },

  // Database
  { name: "MySQL", category: "Database", description: "World's most popular open-source relational database" },
  { name: "PostgreSQL", category: "Database", description: "Powerful open-source object-relational SQL database" },
  { name: "MongoDB", category: "Database", description: "Document-oriented NoSQL database for flexible JSON schemas" },
  { name: "Redis", category: "Database", description: "In-memory key-value cache and real-time data store" },
  { name: "SQLite", category: "Database", description: "Self-contained serverless SQL database engine" },
  { name: "Elasticsearch", category: "Database", description: "Distributed RESTful search and analytics engine" },
  { name: "Supabase", category: "Database", description: "Open-source backend and PostgreSQL database platform" },
  { name: "Prisma", category: "Database", description: "Type-safe ORM for Node.js and TypeScript" },

  // Cloud / DevOps
  { name: "Docker", category: "Cloud / DevOps", description: "Platform for containerizing applications and microservices" },
  { name: "Kubernetes", category: "Cloud / DevOps", description: "Production-grade container orchestration system" },
  { name: "AWS", category: "Cloud / DevOps", description: "Amazon Web Services comprehensive cloud computing suite" },
  { name: "Google Cloud (GCP)", category: "Cloud / DevOps", description: "Google Cloud infrastructure and computing services" },
  { name: "Microsoft Azure", category: "Cloud / DevOps", description: "Enterprise cloud platform for computing and storage" },
  { name: "CI/CD", category: "Cloud / DevOps", description: "Continuous integration and automated delivery pipelines" },
  { name: "Git", category: "Cloud / DevOps", description: "Distributed version control system for source code" },
  { name: "GitHub Actions", category: "Cloud / DevOps", description: "Automated workflow and CI/CD directly inside GitHub" },
  { name: "Terraform", category: "Cloud / DevOps", description: "Declarative Infrastructure as Code (IaC) tool" },
  { name: "Linux", category: "Cloud / DevOps", description: "Open-source operating system kernel for server workloads" },
  { name: "Nginx", category: "Cloud / DevOps", description: "High-performance web server and reverse proxy" },

  // AI / ML
  { name: "Python", category: "AI / ML", description: "Premier language for AI, data science, and backend APIs" },
  { name: "Machine Learning", category: "AI / ML", description: "Statistical algorithms that learn patterns from data" },
  { name: "Deep Learning", category: "AI / ML", description: "Multi-layered artificial neural network architectures" },
  { name: "PyTorch", category: "AI / ML", description: "Leading deep learning research framework by Meta" },
  { name: "TensorFlow", category: "AI / ML", description: "End-to-end open source platform for machine learning" },
  { name: "Scikit-Learn", category: "AI / ML", description: "Machine learning library for data mining and modeling" },
  { name: "Pandas", category: "AI / ML", description: "Data analysis and tabular manipulation library for Python" },
  { name: "NumPy", category: "AI / ML", description: "Fundamental numerical computing package for Python" },

  // Systems / Web3
  { name: "C", category: "Systems", description: "Foundational procedural systems programming language" },
  { name: "C++", category: "Systems", description: "High-performance compiled language with OOP & templates" },
  { name: "Blockchain", category: "Systems", description: "Decentralized immutable distributed ledger technology" },
  { name: "Solidity", category: "Systems", description: "Smart contract programming language for Ethereum" },
  { name: "Smart Contracts", category: "Systems", description: "Self-executing blockchain programs with verifiable logic" },
  { name: "Cryptography", category: "Systems", description: "Mathematical protocols for secure hashes and signatures" },
];

export interface SkillAutocompleteInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onSelectCategory?: (category: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

export function SkillAutocompleteInput({
  label = "Skill Name",
  value,
  onChange,
  onSelectCategory,
  placeholder = "Type a skill (e.g. Java, React, Docker)...",
  required = false,
  id = "skill-autocomplete-input",
  error,
  helperText,
  className = "",
}: SkillAutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [apiSuggestions, setApiSuggestions] = useState<SkillSuggestion[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce API suggestions for custom skills stored on the server
  useEffect(() => {
    if (!value || value.trim().length === 0) {
      setApiSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const query = encodeURIComponent(value.trim());
        const data = await apiRequest<SkillSuggestion[]>(`/skills/suggest?q=${query}`).catch(() => []);
        if (Array.isArray(data)) {
          setApiSuggestions(data);
        }
      } catch {
        // Fallback to static catalog if network request is unavailable
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [value]);

  // Combine static catalog with API suggestions, prioritizing prefix matches
  const suggestions = useMemo(() => {
    const q = (value || "").trim().toLowerCase();
    if (!q) return [];

    const map = new Map<string, SkillSuggestion>();

    // 1. Static catalog
    STATIC_SKILL_CATALOG.forEach((item) => map.set(item.name.toLowerCase(), item));

    // 2. API suggestions (e.g. dynamic skills from DB)
    apiSuggestions.forEach((item) => {
      if (!map.has(item.name.toLowerCase())) {
        map.set(item.name.toLowerCase(), item);
      }
    });

    const all = Array.from(map.values());

    // Group 1: Starts with query (Prefix match - e.g. "j" -> "Java", "JavaScript", "Jenkins")
    const prefixMatches = all
      .filter((s) => s.name.toLowerCase().startsWith(q))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Group 2: Contains query but does not start with it (e.g. "Next.js" for "j")
    const containsMatches = all
      .filter((s) => !s.name.toLowerCase().startsWith(q) && s.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));

    return [...prefixMatches, ...containsMatches].slice(0, 10);
  }, [value, apiSuggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: SkillSuggestion) => {
    onChange(item.name);
    if (onSelectCategory && item.category) {
      onSelectCategory(item.category);
    }
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "ArrowDown" && suggestions.length > 0) {
        setIsOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  // Helper to highlight matching text
  const renderHighlightedName = (name: string, query: string) => {
    if (!query) return name;
    const lowerName = name.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerName.indexOf(lowerQuery);

    if (index === -1) return name;

    const before = name.substring(0, index);
    const match = name.substring(index, index + query.length);
    const after = name.substring(index + query.length);

    return (
      <span>
        {before}
        <span className="font-bold text-[#5555A5] bg-[#5555A5]/10 rounded px-0.5">{match}</span>
        {after}
      </span>
    );
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Backend":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Frontend":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Database":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Cloud / DevOps":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "AI / ML":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Systems":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className={`relative w-full space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="block text-xs font-medium text-[#191919]">
            {label}
            {required && <span className="text-[#DC2626] ml-0.5">*</span>}
          </label>
          <span className="text-[10px] text-[#77756F] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#5555A5]" />
            Live Suggestions
          </span>
        </div>
      )}

      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={value}
          required={required}
          autoComplete="off"
          placeholder={placeholder}
          onFocus={() => {
            if (value.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className={`flex h-9 w-full rounded-[4px] border bg-[#FFFFFF] px-3 py-1 text-sm text-[#191919] placeholder:text-[#77756F] transition-all focus:outline-none focus:border-[#5555A5] focus:ring-1 focus:ring-[#5555A5] ${
            error ? "border-[#DC2626]" : "border-[#DFDDD6]"
          }`}
        />

        {value && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              onChange("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#77756F] hover:text-[#191919] p-0.5 rounded"
            title="Clear input"
          >
            ✕
          </button>
        )}
      </div>

      {error && <p className="text-xs text-[#DC2626]">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#77756F]">{helperText}</p>}

      {/* Suggestion Dropdown */}
      {isOpen && value.trim().length > 0 && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-[6px] border border-[#DFDDD6] bg-[#FFFFFF] shadow-xl py-1 divide-y divide-[#F0EFEA] animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] font-medium text-[#77756F] uppercase tracking-wider bg-[#FAF9F5] flex items-center justify-between">
            <span>Matching Skills ({suggestions.length})</span>
            <span>Use ↑↓ to navigate, Enter to pick</span>
          </div>

          {suggestions.map((item, idx) => {
            const isSelected = activeIndex === idx;
            const isExactMatch = item.name.toLowerCase() === value.trim().toLowerCase();

            return (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => handleSelect(item)}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between text-left transition-colors ${
                  isSelected ? "bg-[#5555A5]/10" : "hover:bg-[#FAF9F5]"
                }`}
              >
                <div className="space-y-0.5 pr-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#191919]">
                      {renderHighlightedName(item.name, value.trim())}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${getCategoryBadgeColor(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-[#77756F] line-clamp-1">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center text-[#77756F]">
                  {isExactMatch ? (
                    <Check className="w-4 h-4 text-[#5555A5]" />
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-[#5555A5]" : "opacity-40"}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State when no suggestions matched */}
      {isOpen && value.trim().length > 0 && suggestions.length === 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 rounded-[6px] border border-[#DFDDD6] bg-[#FFFFFF] shadow-lg p-3 text-center text-xs text-[#77756F]">
          <p>
            No catalog matches for &quot;
            <span className="font-semibold text-[#191919]">{value.trim()}</span>&quot;.
          </p>
          <p className="text-[11px] mt-0.5 text-[#5555A5]">
            You can still submit this as a custom technical skill!
          </p>
        </div>
      )}
    </div>
  );
}
