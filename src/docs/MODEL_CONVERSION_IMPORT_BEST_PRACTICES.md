
# Model Conversion Import Best Practices

## Resolving Import Errors

### Common Import Error Patterns
1. **Missing Converter Files**: Always ensure that for each entity type, you have corresponding converter files in the `src/utils/modelConversions/` directory.

### Naming Conventions
- Use the format `<entityName>Converters.ts` 
- Export functions following the pattern:
  - `to<EntityName>Model`
  - `to<EntityName>Entity`
  - `to<EntityName>Models`
  - `to<EntityName>Entities`

### Troubleshooting Steps
1. Check the `modelConversions/index.ts` file for correct import paths
2. Verify that the corresponding converter file exists
3. Ensure the file contains the expected exports
4. Use TypeScript type guards for safe conversions

### Prevention Checklist
- [ ] Create converter files for each entity type
- [ ] Maintain consistent naming in `index.ts`
- [ ] Use explicit type conversions
- [ ] Handle undefined/null cases in converters
