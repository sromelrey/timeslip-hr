## 📝 Description
<!-- Provide a clear and concise description of what this PR accomplishes -->



## 🔗 Related Tickets
- Closes #
- Relates to EPIC-

## 🏷️ Type of Change
<!-- Mark the relevant option with an [x] -->
- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 UI/UX improvement
- [ ] ♻️ Refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test addition/update

## 💡 Implementation Details
<!-- Explain your technical approach, key decisions, or architectural choices -->



## 🧪 Testing Instructions
<!-- Describe how to test the changes -->
1. 
2. 
3. 

## 📸 Screenshots / Videos
<!-- If applicable, add screenshots or screen recordings to demonstrate the changes -->
<!-- Delete this section if not applicable -->



## ⚠️ Breaking Changes
<!-- List any breaking changes and migration steps required -->
<!-- Delete this section if not applicable -->



---

## ✅ Standards Checklist
*Please verify that your PR follows our project standards before submitting.*

### 🎨 Frontend Standards
<!-- Only check items relevant to your changes -->
- [ ] **Components**: Used `PascalCase` and strictly typed props (no `any`)
- [ ] **State**: Used `useAppSelector` / `useAppDispatch` for Redux
- [ ] **API**: Used the centralized `api` instance from `lib/api.ts`
- [ ] **Hooks**: Extracted complex business logic into custom `use*` hooks
- [ ] **Styling**: Used Tailwind utility classes and `cn()` helper
- [ ] **Testing**: Added Unit/Component tests (RTL) for new features

### ⚙️ Backend Standards
<!-- Only check items relevant to your changes -->
- [ ] **Architecture**: Business logic is in Services, NOT Controllers
- [ ] **Database**: Used `common.entity` and proper TypeORM relations
- [ ] **Validation**: DTOs created with `class-validator` for all inputs
- [ ] **Testing**: Added unit tests (`*.spec.ts`) for services
- [ ] **Security**: Endpoints protected with `@ApiBearerAuth` and Guards
- [ ] **Swagger**: Documented new endpoints with `@ApiOperation` and `@ApiResponse`

### 🛡️ General Quality
- [ ] **Linting**: Ran `pnpm lint` and fixed all errors
- [ ] **Types**: Zero `any` types used
- [ ] **Build**: Verified project builds successfully (`pnpm build`)
- [ ] **Tests**: All tests pass (`pnpm test`)
- [ ] **Self-Review**: Reviewed my own code for logic errors and edge cases

## 📋 Reviewer Notes
<!-- Any specific areas you'd like reviewers to focus on -->


