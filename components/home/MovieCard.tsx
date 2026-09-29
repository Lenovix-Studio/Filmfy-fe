"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, Heart, Star, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Movie } from "@/lib/types";

export interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="group relative overflow-hidden transition-all duration-300 bg-white border border-slate-200/80 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/10 hover:-translate-y-1 rounded-2xl flex flex-col h-80 p-0">
        <div className="relative aspect-2/3 w-full bg-slate-100 overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
            {movie.status && (
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-md text-[10px] gap-1 px-2 py-0.5 border border-slate-200/60 font-semibold text-slate-700 shadow-xs"
              >
                {movie.status === "FAVORITE" && (
                  <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500/20" />
                )}
                {movie.status === "DELETED" && (
                  <Trash2 className="w-3 h-3 text-rose-500" />
                )}
                {movie.status}
              </Badge>
            )}

            {movie.rating && (
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-md text-[10px] gap-1 px-2 py-0.5 border border-slate-200/60 font-bold text-amber-600 shadow-xs ml-auto"
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {movie.rating}
              </Badge>
            )}
          </div>

          {movie.isFavorite && (
            <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-rose-600 text-white shadow-md shadow-rose-600/30">
              <Heart className="w-3.5 h-3.5 fill-white" />
            </div>
          )}
        </div>

        <CardContent className="p-3.5 flex flex-col flex-1 justify-between bg-white">
          <div>
            <h3 className="font-semibold text-sm text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1">
              {movie.title}
            </h3>
            <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-wider font-medium">
              {movie.code}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
