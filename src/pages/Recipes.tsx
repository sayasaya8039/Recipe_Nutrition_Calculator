import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { RecipeCard } from "@/components/RecipeCard";
import { useRecipeStore } from "@/stores/recipeStore";
import { useNavigate } from "react-router-dom";

export function Recipes() {
  const [search, setSearch] = useState("");
  const { recipes, deleteRecipe } = useRecipeStore();
  const navigate = useNavigate();

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 検索バー */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sub-text" />
          <Input
            placeholder="レシピを検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => navigate("/")}>
          <Plus className="h-4 w-4" />
          新規作成
        </Button>
      </div>

      {/* レシピ一覧 */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sub-text mb-4">
            {recipes.length === 0
              ? "まだレシピがありません"
              : "該当するレシピがありません"}
          </p>
          {recipes.length === 0 && (
            <Button onClick={() => navigate("/")}>
              <Plus className="h-4 w-4" />
              レシピを作成
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={deleteRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
}
