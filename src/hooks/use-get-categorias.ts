"use client"

import { getCachedCategorias } from "@/app/actions/catalogo/categoria"
import { Categoria } from "@/entity/categoria-entity"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export function useGetCategorias() {
  const [categories, setCategories] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // O useCallback garante que a função não seja recriada a cada render
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      setIsError(false)
      
      const data = await getCachedCategorias()
      setCategories(data)
      
    } catch (error) {
      console.error("Erro ao buscar categorias", error)
      setIsError(true)
      toast.error("Erro ao buscar convites", {
                position: 'top-center'
            });
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Carrega automaticamente ao montar o componente
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { 
    categories, 
    isLoading, 
    isError, 
    refetch: fetchCategories
  }
}