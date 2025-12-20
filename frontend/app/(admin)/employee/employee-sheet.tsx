import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useEmployeeForm, useEmployeeManagement } from "@/hooks/employees"
import { Employee } from "@/store/core/thunks/employee-thunks"

interface EmployeeSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeToEdit?: Employee | null
}

export function EmployeeSheet({
  open,
  onOpenChange,
  employeeToEdit,
}: EmployeeSheetProps) {
  const {
    formData,
    handleChange,
    handleSelectChange,
    handleCheckedChange,
    resetForm,
    getFormattedData,
    setFormFromEntity,
  } = useEmployeeForm()

  const { createEmployee, updateEmployee } = useEmployeeManagement()

  useEffect(() => {
    if (open) {
      if (employeeToEdit) {
        setFormFromEntity(employeeToEdit)
      } else {
        resetForm()
      }
    }
  }, [open, employeeToEdit, setFormFromEntity, resetForm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const dto = getFormattedData()
    
    try {
      if (employeeToEdit) {
        await updateEmployee(employeeToEdit.id, dto)
      } else {
        await createEmployee(dto)
      }
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save employee:", error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>{employeeToEdit ? "Edit Employee" : "Add Employee"}</SheetTitle>
          <SheetDescription>
            {employeeToEdit
              ? "Make changes to the employee profile here. Click save when you're done."
              : "Add a new employee to your organization. Click save when you're done."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </div>

            <div className="grid gap-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) => handleSelectChange("employmentType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALARIED">Salaried</SelectItem>
                  <SelectItem value="HOURLY">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
               <Label htmlFor="rate">
                 {formData.employmentType === 'SALARIED' 
                    ? 'Monthly Salary' 
                    : formData.employmentType === 'HOURLY' 
                        ? 'Hourly Rate' 
                        : 'Daily Rate'}
               </Label>
               <Input
                 id="rate"
                 name="rate"
                 type="number"
                 step="0.01"
                 value={formData.rate}
                 onChange={handleChange}
                 placeholder="0.00"
               />
             </div>
          
          <div className="grid gap-2">
              <Label htmlFor="hiredAt">Hire Date</Label>
              <Input
                id="hiredAt"
                name="hiredAt"
                type="date"
                value={formData.hiredAt}
                onChange={handleChange}
                required
              />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => 
                handleCheckedChange("isActive", checked as boolean)
              }
            />
            <Label htmlFor="isActive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Active Employee
            </Label>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit">
              {employeeToEdit ? "Save Changes" : "Create Employee"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
