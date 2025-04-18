import { defineStore } from 'pinia'
import { adduserfav , deluserfav } from '@/api/fav'
import { addItemToCart , removeItemFromCart } from '@/api/cart'
export const useUserStore = defineStore ('user',
    {
        state: () => ({
            user: null as null | {
              id: number,
              username: string,
              email:string,
              role: string,
              token: string,
              favorites: number[],
              carts:{ special_code: string; quantity: number }[]
            },
          }),
        actions: {
            setUser(userData: any) {
              this.user = userData
              sessionStorage.setItem('user', JSON.stringify(userData))
              
            },
        
            clearUser() {
              this.user = null
              sessionStorage.removeItem('user')
              
            },
        
            loadUserFromSession() {
              const sessionData = sessionStorage.getItem('user')
              if (sessionData) {
                this.user = JSON.parse(sessionData)
                console.log('session 1;')
              }
              
            },

            //收藏api觸發
            async addToFavorites(product_id: number) {
              if (this.user) {
                const user_id = this.user.id;
                const data = {user_id,product_id};
                const success = await adduserfav(data);
                if (success) {
                  this.user.favorites.push(product_id)
                }
              }
            },

            async DelToFavorites(product_id: number) {
              if (this.user) {
                const user_id = this.user.id;
                const data = {user_id,product_id};
                const success = await deluserfav(data);
                if (success) {
                  this.user.favorites = this.user.favorites.filter(id => id !== product_id)
                }
              }
            },

            //購物車觸發
            async addToCarts(special_code: string,quantity: number) {
              if (this.user) {
                const user_id = this.user.id;
                const data = {user_id,special_code,quantity};
                const success = await addItemToCart(data);
                if (success) {
                  this.user.carts.push({ special_code, quantity });
                }
              }
            },

            async DelToCarts(special_code: string) {
              if (this.user) {
                const user_id = this.user.id;
                const data = {user_id,special_code};
                const success = await removeItemFromCart(data);
                if (success) {
                  this.user.carts = this.user.carts.filter(item => item.special_code !== special_code);
                }
              }
            },
            
        },
    }
)