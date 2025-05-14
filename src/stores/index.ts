import { defineStore } from 'pinia'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'
import { adduserfav, deluserfav } from '@/api/fav'
import { addItemToCart, removeItemFromCart } from '@/api/cart'

// 定義 User 的型別
interface CartItem {
  special_code: string
  quantity: number
}

interface User {
  id: number
  username: string
  email: string
  role: string
  phone:number
  token: string
  favorites: number[]
  carts: CartItem[]
}

export const useStateStore = defineStore('state',{
  state: ()=>({
    justlogin: false,
  })
}

)

// 正式建立 store
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),

  actions: {
    // 登入時設定使用者資料
    setUser(userData: User) {
      this.user = userData
    },

    // 登出時清空使用者資料
    clearUser() {
      localStorage.removeItem('user');
    },

    // 收藏商品
    async addToFavorites(product_id: number) {
      if (!this.user) return

      const success = await adduserfav({
        user_id: this.user.id,
        product_id,
      })

      if (success) {
        this.user.favorites.push(product_id)
      }
    },

    // 移除收藏
    async DelToFavorites(product_id: number) {
      if (!this.user) return

      const success = await deluserfav({
        user_id: this.user.id,
        product_id,
      })

      if (success) {
        console.log("del fav suc")
        this.user.favorites = this.user.favorites.filter((id: number) => id !== product_id)
        history.go(0);
      }
    },

    // 加入購物車
    async addToCarts(special_code: string, quantity: number) {
      if (!this.user) return

      const success = await addItemToCart({
        user_id: this.user.id,
        special_code,
        quantity,
      })

      if (success) {
        this.user.carts.push({ special_code, quantity })
      }
    },

    // 移除購物車商品
    async DelToCarts(special_code: string) {
      if (!this.user) return

      const success = await removeItemFromCart({
        user_id: this.user.id,
        special_code,
      })

      if (success) {
        this.user.carts = this.user.carts.filter((item: { special_code: string }) => item.special_code !== special_code)
      }
      return success;
    },
  },

  persist: {
    storage: localStorage,
  } as PersistenceOptions,
})
