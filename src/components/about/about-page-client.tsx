"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Award,
  ShieldCheck,
  CheckCircle2,
  Users,
  BookOpen,
  GraduationCap,
  Sparkles,
  Target,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
  Globe,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ─────────────────── Types ─────────────────── */
export interface AboutInstructor {
  id: number | string;
  name: string;
  name_bn?: string;
  designation?: string;
  institution?: string;
  bio?: string;
  photo_url?: string;
  display_order?: number;
  is_featured?: boolean;
}

interface AboutPageClientProps {
  instructors: AboutInstructor[];
  totalCourses: number;
  totalStudents: number;
  totalInstructors: number;
}

/* ─────────────────── Animated Section ─────────────────── */
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────── Stats Counter ─────────────────── */
function AnimatedStat({
  value,
  suffix = "",
  label,
  labelBn,
  icon: Icon,
  color,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  labelBn: string;
  icon: LucideIcon;
  color: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="group relative bg-surface/80 backdrop-blur-sm border border-border/60 rounded-2xl p-5 sm:p-6 text-center hover:border-primary/30 transition-all duration-300 hover:shadow-md overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: `radial-gradient(circle at center, ${color}08 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-text font-sans tracking-tight">
          {isInView ? value.toLocaleString("bn-BD") : "০"}
          {suffix}
        </div>
        <div className="text-xs font-bold text-text-muted font-bengali mt-1">
          {labelBn}
        </div>
        <div className="text-[10px] font-semibold text-text-muted/60 font-sans uppercase tracking-wider mt-0.5">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────── Value Card ─────────────────── */
const VALUE_CARDS = [
  {
    icon: Compass,
    title: "আমাদের মিশন",
    titleEn: "Our Mission",
    description:
      "দেশের যেকোনো প্রান্তের প্রতিটি শিক্ষার্থী যেন রাজধানী বা বড় শহরের সেরা শিক্ষকদের বিশ্বমানের অ্যাকাডেমিক ও ভর্তি গাইডলাইন সাশ্রয়ী মূল্যে গ্রহণ করতে পারে।",
    gradient: "from-orange-500 to-rose-500",
    bgGlow: "from-orange-500/10 via-transparent to-transparent",
    iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    icon: Award,
    title: "আমাদের ভিশন",
    titleEn: "Our Vision",
    description:
      "বাংলাদেশের প্রধান অনলাইন শিক্ষা প্ল্যাটফর্ম হিসেবে আত্মপ্রকাশ করা, যা কেবল পরীক্ষায় ভালো নম্বর পাওয়ায় নয়, বরং শিক্ষার্থীদের স্বনির্ভর ও উদ্ভাবনী চিন্তায় গড়ে তোলে।",
    gradient: "from-purple-500 to-indigo-500",
    bgGlow: "from-purple-500/10 via-transparent to-transparent",
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    icon: ShieldCheck,
    title: "আমাদের অঙ্গীকার",
    titleEn: "Our Values",
    description:
      "স্বচ্ছতা, শিক্ষায় আপসহীন মান, নির্ভরযোগ্য সাপোর্ট এবং প্রতিটি শিক্ষার্থীর ব্যক্তিগত অগ্রগতির প্রতি সজাগ দৃষ্টি রাখা।",
    gradient: "from-emerald-500 to-teal-500",
    bgGlow: "from-emerald-500/10 via-transparent to-transparent",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

/* ─────────────────── Feature Items ─────────────────── */
const FEATURES = [
  {
    icon: Lightbulb,
    title: "কনসেপ্ট ক্লিয়ারিং ক্লাস",
    description: "মৌলিক সূত্র থেকে শুরু করে জটিল গাণিতিক সমস্যার স্পষ্ট সমাধান।",
    color: "#F59E0B",
  },
  {
    icon: Star,
    title: "দেশসেরা মেন্টর প্যানেল",
    description: "বুয়েট, ডিএমসি ও ঢাবির কৃতি শিক্ষার্থীদের সরাসরি পাঠদান।",
    color: "#8B5CF6",
  },
  {
    icon: Zap,
    title: "লাইভ ক্লাস ও সাপোর্ট",
    description: "নিয়মিত লাইভ ক্লাস, ডাউট সেশন এবং পরীক্ষা-পূর্ব রিভিশন ক্লাস।",
    color: "#10B981",
  },
  {
    icon: Globe,
    title: "যেকোনো জায়গা থেকে শেখা",
    description: "ইন্টারনেট সংযোগ থাকলেই দেশের যেকোনো প্রান্ত থেকে শেখার সুযোগ।",
    color: "#3B82F6",
  },
];

/* ─────────────────── Main Component ─────────────────── */
export function AboutPageClient({
  instructors,
  totalCourses,
  totalStudents,
  totalInstructors,
}: AboutPageClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeList = instructors.length > 0 ? instructors : [];
  const currentInstructor = activeList[activeIndex] || null;

  const handleSelect = useCallback(
    (index: number) => {
      if (index === activeIndex || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsTransitioning(false);
      }, 180);
    },
    [activeIndex, isTransitioning]
  );

  const handlePrev = useCallback(() => {
    if (activeList.length <= 1) return;
    handleSelect((activeIndex - 1 + activeList.length) % activeList.length);
  }, [activeIndex, activeList.length, handleSelect]);

  const handleNext = useCallback(() => {
    if (activeList.length <= 1) return;
    handleSelect((activeIndex + 1) % activeList.length);
  }, [activeIndex, activeList.length, handleSelect]);

  return (
    <div className="bg-background min-h-screen">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28">
        {/* Ambient backgrounds */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/8 via-rose-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-purple-500/8 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/3 to-purple-500/3 rounded-full blur-3xl pointer-events-none" />

        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary font-bengali mb-5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              আমাদের গল্প ও দর্শন
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-black text-text font-bengali tracking-tight leading-[1.2] mb-5">
              গুণগত শিক্ষা হোক{" "}
              <span className="bg-gradient-to-r from-primary via-rose-500 to-purple-500 bg-clip-text text-transparent">
                সবার জন্য
              </span>{" "}
              উন্মুক্ত ও ফলপ্রসূ
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-text-muted font-bengali leading-relaxed max-w-2xl mx-auto">
              অর্মিশন (Ormission) একটি আধুনিক ও মানবিক শিক্ষা উদ্যোগ। আমাদের
              মূল লক্ষ্য শিক্ষার্থীদের মুখস্থবিদ্যার গণ্ডি থেকে বের করে
              যৌক্তিক বিশ্লেষণ, গভীর কনসেপচুয়াল বোঝাপড়া এবং আত্মবিশ্বাসী
              মেধা হিসেবে গড়ে তোলা।
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="container-main -mt-8 sm:-mt-10 relative z-20 mb-16 sm:mb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <AnimatedStat
            value={totalCourses > 0 ? totalCourses : 10}
            suffix="+"
            label="Courses"
            labelBn="কোর্স"
            icon={BookOpen}
            color="#FF5F00"
            delay={0}
          />
          <AnimatedStat
            value={totalStudents > 0 ? totalStudents : 500}
            suffix="+"
            label="Students"
            labelBn="শিক্ষার্থী"
            icon={Users}
            color="#7C3AED"
            delay={0.1}
          />
          <AnimatedStat
            value={totalInstructors > 0 ? totalInstructors : 10}
            suffix="+"
            label="Instructors"
            labelBn="শিক্ষক"
            icon={GraduationCap}
            color="#0D9488"
            delay={0.2}
          />
          <AnimatedStat
            value={100}
            suffix="%"
            label="Dedication"
            labelBn="নিবেদন"
            icon={Heart}
            color="#EF4444"
            delay={0.3}
          />
        </div>
      </section>

      {/* ─── Mission / Vision / Values ─── */}
      <section className="container-main mb-16 sm:mb-24">
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text font-bengali tracking-tight">
            আমাদের{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              মূল স্তম্ভ
            </span>
          </h2>
          <p className="text-sm text-text-muted font-bengali mt-2 max-w-lg mx-auto">
            যেসব মূল্যবোধ ও লক্ষ্যের উপর ভিত্তি করে ওরমিশন কাজ করে
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {VALUE_CARDS.map((card, i) => (
            <AnimatedSection key={card.titleEn} delay={i * 0.12}>
              <div className="group relative bg-surface rounded-2xl border border-border/60 p-7 sm:p-8 hover:border-transparent transition-all duration-500 hover:shadow-lg overflow-hidden h-full">
                {/* Gradient border on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="absolute inset-[1px] rounded-2xl bg-surface group-hover:bg-surface/95 transition-colors duration-300" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <card.icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-text font-bengali mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-[10px] font-bold text-text-muted/50 uppercase tracking-wider font-sans mb-3">
                    {card.titleEn}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-text-muted font-bengali leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ─── Story Section ─── */}
      <section className="container-main mb-16 sm:mb-24">
        <AnimatedSection>
          <div className="relative bg-surface rounded-3xl border border-border/60 p-6 sm:p-8 lg:p-12 overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 via-transparent to-transparent rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent rounded-full pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Text */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary font-bengali mb-4">
                  <Target className="w-3 h-3" />
                  আমাদের পথচলা
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-text font-bengali leading-snug mb-4">
                  শিক্ষার্থীদের প্রকৃত ভীতি দূর করাই আমাদের{" "}
                  <span className="text-primary">পথচলার সূচনা</span>
                </h2>

                <p className="text-sm text-text-muted font-bengali leading-relaxed mb-3">
                  এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার সময় লাখ লাখ
                  শিক্ষার্থী সঠিক দিকনির্দেশনা ও ভালো মেন্টরশিপের অভাবে
                  পিছিয়ে পড়ে। অর্মিশন তৈরি হয়েছে সেই শূন্যতা পূরণ করতে।
                </p>
                <p className="text-sm text-text-muted font-bengali leading-relaxed">
                  এখানে প্রতিটি লেকচার তৈরি হয় নিবিড় পরিকল্পনায়। কোনো
                  অপ্রয়োজনীয় সময়ক্ষেপণ ছাড়া সম্পূর্ণ সিলেবাস ভিত্তিক
                  টু-দ্য-পয়েন্ট আলোচনা ও বাস্তব সমস্যা সমাধানের পদ্ধতি
                  আমাদের বিশেষত্ব।
                </p>
              </div>

              {/* Right: Feature cards */}
              <div className="space-y-3">
                {FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="group flex items-start gap-3.5 p-4 rounded-xl bg-surface-secondary/70 border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-sm"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        backgroundColor: `${feature.color}15`,
                        color: feature.color,
                      }}
                    >
                      <feature.icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text text-sm font-bengali mb-0.5">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-text-muted font-bengali leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ─── Team / Instructors Showcase ─── */}
      {activeList.length > 0 && (
        <section className="container-main mb-16 sm:mb-24">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text font-bengali tracking-tight">
              আমাদের{" "}
              <span className="bg-gradient-to-r from-purple-500 to-primary bg-clip-text text-transparent">
                শিক্ষক ও মেন্টরগণ
              </span>
            </h2>
            <p className="text-sm text-text-muted font-bengali mt-2 max-w-lg mx-auto">
              দেশের সেরা বিশ্ববিদ্যালয় থেকে আসা আমাদের নিবেদিত শিক্ষক দল
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="relative max-w-4xl mx-auto">
              {/* Main showcase card */}
              <div className="relative bg-surface rounded-3xl border border-border/60 p-6 sm:p-8 lg:p-10 overflow-hidden">
                {/* Glow */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-500/8 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-primary/8 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

                {currentInstructor && (
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 items-center">
                    {/* Avatar */}
                    <div className="sm:col-span-4 flex flex-col items-center">
                      <div className="relative">
                        {/* Navigation arrows for multiple instructors */}
                        {activeList.length > 1 && (
                          <>
                            <button
                              onClick={handlePrev}
                              className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-text-muted hover:text-text hover:border-primary/40 transition-all"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleNext}
                              className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-text-muted hover:text-text hover:border-primary/40 transition-all"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        <div
                          className={`w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden ring-4 ring-primary/10 shadow-lg transition-all duration-300 ${
                            isTransitioning
                              ? "opacity-30 scale-95"
                              : "opacity-100 scale-100"
                          }`}
                        >
                          {currentInstructor.photo_url ? (
                            <Image
                              src={currentInstructor.photo_url}
                              alt={
                                currentInstructor.name_bn ||
                                currentInstructor.name
                              }
                              width={192}
                              height={192}
                              className="w-full h-full object-cover object-top"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                              <span className="text-4xl font-black text-primary/40">
                                {(
                                  currentInstructor.name_bn ||
                                  currentInstructor.name
                                ).charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Carousel dots */}
                      {activeList.length > 1 && (
                        <div className="flex items-center gap-1.5 mt-4">
                          {activeList.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelect(idx)}
                              className={`transition-all duration-300 rounded-full ${
                                idx === activeIndex
                                  ? "w-6 h-1.5 bg-primary"
                                  : "w-1.5 h-1.5 bg-border hover:bg-primary/40"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div
                      className={`sm:col-span-8 transition-opacity duration-200 ${
                        isTransitioning ? "opacity-30" : "opacity-100"
                      }`}
                    >
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-sans mb-3">
                        <Star className="w-3 h-3" />
                        {currentInstructor.designation || "শিক্ষক"}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-text font-bengali mb-1">
                        {currentInstructor.name_bn || currentInstructor.name}
                      </h3>

                      {currentInstructor.institution && (
                        <p className="text-xs font-semibold text-primary font-sans uppercase tracking-wider mb-3">
                          {currentInstructor.institution}
                        </p>
                      )}

                      {currentInstructor.bio && (
                        <p className="text-sm text-text-muted font-bengali leading-relaxed">
                          {currentInstructor.bio}
                        </p>
                      )}

                      {!currentInstructor.bio && (
                        <p className="text-sm text-text-muted font-bengali leading-relaxed">
                          ওরমিশন-এর একজন নিবেদিত শিক্ষক যিনি শিক্ষার্থীদের
                          মানসম্মত শিক্ষা প্রদানে অঙ্গীকারবদ্ধ।
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Mini avatars for quick switching */}
                {activeList.length > 1 && (
                  <div className="relative z-10 flex items-center justify-center gap-2 mt-6 pt-5 border-t border-border/40">
                    {activeList.map((inst, idx) => (
                      <button
                        key={inst.id}
                        onClick={() => handleSelect(idx)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bengali transition-all duration-200 ${
                          idx === activeIndex
                            ? "bg-primary/10 border-primary/40 text-primary font-bold"
                            : "bg-surface-secondary border-border text-text-muted hover:border-primary/30"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full overflow-hidden bg-surface-secondary flex-shrink-0 flex items-center justify-center text-[9px] font-bold">
                          {inst.photo_url ? (
                            <img
                              src={inst.photo_url}
                              alt=""
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <span>
                              {(inst.name_bn || inst.name).charAt(0)}
                            </span>
                          )}
                        </span>
                        <span className="truncate max-w-[90px]">
                          {inst.name_bn || inst.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* ─── CTA Section ─── */}
      <section className="container-main pb-16 sm:pb-24">
        <AnimatedSection>
          <div className="relative bg-gradient-to-br from-primary/5 via-purple-500/5 to-rose-500/5 rounded-3xl border border-primary/10 p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20px 20px, currentColor 1px, transparent 0)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary font-bengali mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  আজই শুরু করুন
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text font-bengali tracking-tight mb-4">
                  আমাদের সাথে আপনার যাত্রা{" "}
                  <span className="text-primary">শুরু করুন</span> আজই
                </h2>

                <p className="text-sm text-text-muted font-bengali max-w-md mx-auto mb-8">
                  সঠিক প্রস্তুতি ও দিকনির্দেশনায় আপনার স্বপ্ন পূরণ করতে
                  আমরা প্রস্তুত
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm font-bengali hover:bg-primary-hover transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    কোর্সসমূহ দেখুন
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-text font-semibold text-sm font-bengali hover:border-primary/40 hover:text-primary transition-all duration-200"
                  >
                    যোগাযোগ করুন
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
