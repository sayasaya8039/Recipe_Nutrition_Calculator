import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { usePlanStore } from "@/stores/planStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { Moon, Sun } from "lucide-react";

export function Settings() {
  const { nutritionGoal, updateNutritionGoal, settings, toggleDarkMode } = usePlanStore();
  const { recipes } = useRecipeStore();

  const handleGoalChange = (key: keyof typeof nutritionGoal, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      updateNutritionGoal({ [key]: num });
    }
  };

  return (
    <div className="space-y-6">
      {/* テーマ設定 */}
      <Card>
        <CardHeader>
          <CardTitle>テーマ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text">ダークモード</p>
              <p className="text-sm text-sub-text">
                目に優しいダークテーマに切り替え
              </p>
            </div>
            <Button
              variant={settings.darkMode ? "default" : "outline"}
              onClick={toggleDarkMode}
            >
              {settings.darkMode ? (
                <>
                  <Moon className="h-4 w-4" />
                  オン
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
                  オフ
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 栄養目標 */}
      <Card>
        <CardHeader>
          <CardTitle>1日の栄養目標</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-text">
                目標カロリー (kcal)
              </label>
              <Input
                type="number"
                value={nutritionGoal.calories}
                onChange={(e) => handleGoalChange("calories", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text">
                タンパク質 (g)
              </label>
              <Input
                type="number"
                value={nutritionGoal.protein}
                onChange={(e) => handleGoalChange("protein", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text">脂質 (g)</label>
              <Input
                type="number"
                value={nutritionGoal.fat}
                onChange={(e) => handleGoalChange("fat", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text">
                炭水化物 (g)
              </label>
              <Input
                type="number"
                value={nutritionGoal.carbs}
                onChange={(e) => handleGoalChange("carbs", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text">
                食物繊維 (g)
              </label>
              <Input
                type="number"
                value={nutritionGoal.fiber}
                onChange={(e) => handleGoalChange("fiber", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text">塩分 (g)</label>
              <Input
                type="number"
                value={nutritionGoal.sodium}
                onChange={(e) => handleGoalChange("sodium", e.target.value)}
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 統計情報 */}
      <Card>
        <CardHeader>
          <CardTitle>データ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text">保存済みレシピ</p>
              <p className="text-sm text-sub-text">{recipes.length}件</p>
            </div>
          </div>
          <div className="pt-4 border-t border-sub-background">
            <p className="text-sm text-sub-text mb-2">
              データはブラウザのローカルストレージに保存されています。
              ブラウザのキャッシュをクリアするとデータが消去されます。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* アプリ情報 */}
      <Card>
        <CardHeader>
          <CardTitle>アプリ情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-sub-text">
          <p>レシピ栄養計算ツール v1.0.0</p>
          <p>材料入力でカロリー・栄養素自動計算、ダイエットプラン生成</p>
          <p>料理好きの救世主 🍳</p>
        </CardContent>
      </Card>
    </div>
  );
}
